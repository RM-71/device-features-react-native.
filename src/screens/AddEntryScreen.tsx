import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, Alert, Animated, ActivityIndicator,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

import { TravelEntryDraft, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDiary } from '../context/DiaryContext';
import { usePermissions } from '../hooks/usePermissions';
import { sendEntrySavedNotification } from '../utils/notifications';
import { validateTravelEntryDraft, validateImageUri } from '../utils/validation';
import { SPACING } from '../constants/theme';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/screens/AddEntryScreen.styles';

type NavProp = StackNavigationProp<RootStackParamList, 'AddEntry'>;

const EMPTY_DRAFT: TravelEntryDraft = {
  imageUri: null, address: '', latitude: null, longitude: null,
};

// ─────────────────────────────────────────────────────────────────────────────

const AddEntryScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { colors } = theme;
  const { addEntry } = useDiary();
  const { requestCameraPermission, requestLocationPermission, requestNotificationPermission } =
    usePermissions();
  const insets = useSafeAreaInsets();

  // ── State ──────────────────────────────────────────────────────────────────
  const [draft, setDraft] = useState<TravelEntryDraft>(EMPTY_DRAFT);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  // ── Animations ─────────────────────────────────────────────────────────────
  const photoY = useRef(new Animated.Value(20)).current;
  const photoAlpha = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(30)).current;
  const cardAlpha = useRef(new Animated.Value(0)).current;
  const saveScale = useRef(new Animated.Value(1)).current;

  // Reset on focus
  useFocusEffect(
    useCallback(() => {
      setDraft(EMPTY_DRAFT);
      setIsFetchingLocation(false);
      setIsSaving(false);
      setLocationDenied(false);
      setManualAddress('');
      setIsManualMode(false);
      photoY.setValue(20);
      photoAlpha.setValue(0);
      cardY.setValue(30);
      cardAlpha.setValue(0);
    }, [])
  );

  useEffect(() => {
    if (!draft.imageUri) return;
    Animated.parallel([
      Animated.spring(photoY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 9 }),
      Animated.timing(photoAlpha, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.spring(cardY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 9 }),
        Animated.timing(cardAlpha, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]),
    ]).start();
  }, [draft.imageUri]);

  // ── Reverse geocode ────────────────────────────────────────────────────────
  const fetchAddress = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (!res?.length) return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
      const p = res[0];
      const parts = [p.street, p.city, p.region, p.country].filter(Boolean);
      return parts.length ? parts.join(', ') : `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
    } catch {
      return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
    }
  }, []);

  // ── Take photo ─────────────────────────────────────────────────────────────
  const handleTakePhoto = useCallback(async (): Promise<void> => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const cameraGranted = await requestCameraPermission();
      if (!cameraGranted) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.92,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const uriCheck = validateImageUri(asset.uri);
      if (!uriCheck.isValid) {
        Alert.alert('Invalid Photo', uriCheck.message ?? 'Could not process photo.');
        return;
      }

      setDraft((prev) => ({ ...prev, imageUri: asset.uri }));
      setIsFetchingLocation(true);
      setLocationDenied(false);
      setIsManualMode(false);

      // Try location
      const locationGranted = await requestLocationPermission();

      if (!locationGranted) {
        // Location denied — switch to manual mode
        setLocationDenied(true);
        setIsManualMode(true);
        setIsFetchingLocation(false);
        setDraft((prev) => ({ ...prev, latitude: 0, longitude: 0 }));
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;
      const address = await fetchAddress(latitude, longitude);

      setDraft((prev) => ({ ...prev, address, latitude, longitude }));
    } catch {
      Alert.alert('Camera Error', 'Failed to open camera. Please check permissions and try again.');
    } finally {
      setIsFetchingLocation(false);
    }
  }, [requestCameraPermission, requestLocationPermission, fetchAddress]);

  // ── Confirm manual address ─────────────────────────────────────────────────
  const handleConfirmManual = useCallback(async (): Promise<void> => {
    const trimmed = manualAddress.trim();
    if (!trimmed) {
      Alert.alert('Address Required', 'Please type a location before confirming.');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft((prev) => ({ ...prev, address: trimmed }));
    setIsManualMode(false);
  }, [manualAddress]);

  // ── Retry auto location ────────────────────────────────────────────────────
  const handleRetryLocation = useCallback(async (): Promise<void> => {
    if (!draft.imageUri) return;
    setIsFetchingLocation(true);
    setLocationDenied(false);
    setIsManualMode(false);

    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        setLocationDenied(true);
        setIsManualMode(true);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;
      const address = await fetchAddress(latitude, longitude);
      setDraft((prev) => ({ ...prev, address, latitude, longitude }));
    } catch {
      setLocationDenied(true);
      setIsManualMode(true);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [draft.imageUri, requestLocationPermission, fetchAddress]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async (): Promise<void> => {
    // If still in manual mode, confirm the typed address first
    const finalDraft = isManualMode
      ? { ...draft, address: manualAddress.trim(), latitude: draft.latitude ?? 0, longitude: draft.longitude ?? 0 }
      : draft;

    const validation = validateTravelEntryDraft(finalDraft);
    if (!validation.isValid) {
      Alert.alert('Cannot Save', validation.message ?? 'Please complete all fields.');
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSaving(true);

      Animated.sequence([
        Animated.spring(saveScale, { toValue: 0.93, useNativeDriver: true, tension: 300 }),
        Animated.spring(saveScale, { toValue: 1, useNativeDriver: true, tension: 80 }),
      ]).start();

      await addEntry({
        imageUri: finalDraft.imageUri!,
        address: finalDraft.address,
        latitude: finalDraft.latitude!,
        longitude: finalDraft.longitude!,
      });

      await requestNotificationPermission();
      await sendEntrySavedNotification(finalDraft.address);
      navigation.goBack();
    } catch {
      setIsSaving(false);
      Alert.alert('Save Failed', 'Could not save entry. Please try again.');
    }
  }, [draft, isManualMode, manualAddress, addEntry, requestNotificationPermission, navigation]);

  const handleBack = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  const addressReady = isManualMode
    ? manualAddress.trim().length > 0
    : !!draft.address;

  const canSave =
    !!draft.imageUri && addressReady && !isFetchingLocation && !isSaving;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <View style={[styles.backCircle, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>New Memory</Text>
            <Text style={[styles.headerSub, { color: colors.textTertiary }]}>
              Capture the moment
            </Text>
          </View>

          <ThemeToggle />
        </View>

        {/* ── Scroll ──────────────────────────────────────────────────── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Photo area */}
          {draft.imageUri ? (
            <Animated.View
              style={[styles.photoWrap, { opacity: photoAlpha, transform: [{ translateY: photoY }] }]}
            >
              <Image source={{ uri: draft.imageUri }} style={styles.photo} resizeMode="cover" />
              <TouchableOpacity
                style={[styles.retakeBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                onPress={handleTakePhoto}
                accessibilityRole="button"
                accessibilityLabel="Retake photo"
              >
                <Text style={styles.retakeIcon}>📷</Text>
                <Text style={styles.retakeLabel}>Retake</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={[styles.photoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleTakePhoto}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Take a photo"
            >
              <View style={[styles.cameraIconRing, { borderColor: colors.border }]}>
                <Text style={styles.cameraEmoji}>📷</Text>
              </View>
              <Text style={[styles.cameraHeading, { color: colors.text }]}>
                Capture the Moment
              </Text>
              <Text style={[styles.cameraSub, { color: colors.textTertiary }]}>
                Tap to open camera
              </Text>
            </TouchableOpacity>
          )}

          {/* Location / manual input card */}
          {draft.imageUri && (
            <Animated.View
              style={[
                styles.locationCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: cardAlpha, transform: [{ translateY: cardY }] },
              ]}
            >
              {/* Card header */}
              <View style={styles.locationCardHeader}>
                <View style={styles.locationCardTitle}>
                  <View style={[styles.locDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.locationLabel, { color: colors.text }]}>Location</Text>
                </View>

                {/* Retry / manual toggle */}
                {!isFetchingLocation && (
                  <View style={styles.locationActions}>
                    {locationDenied && !isManualMode && (
                      <TouchableOpacity
                        onPress={handleRetryLocation}
                        style={[styles.actionChip, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                      >
                        <Text style={[styles.actionChipText, { color: colors.accent }]}>↺ Retry</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => setIsManualMode((v) => !v)}
                      style={[styles.actionChip, {
                        backgroundColor: isManualMode ? colors.accent : colors.surfaceElevated,
                        borderColor: isManualMode ? colors.accent : colors.border,
                      }]}
                    >
                      <Text style={[styles.actionChipText, { color: isManualMode ? '#000' : colors.textSecondary }]}>
                        ✏️ {isManualMode ? 'Auto' : 'Manual'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Fetching spinner */}
              {isFetchingLocation && (
                <View style={styles.fetchingRow}>
                  <LoadingSpinner size={18} />
                  <Text style={[styles.fetchingText, { color: colors.textSecondary }]}>
                    Detecting your location…
                  </Text>
                </View>
              )}

              {/* Manual input */}
              {!isFetchingLocation && isManualMode && (
                <View style={styles.manualWrap}>
                  <Text style={[styles.manualHint, { color: colors.textTertiary }]}>
                    Location access was denied. Type your location manually:
                  </Text>
                  <View style={[styles.manualInputRow, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
                    <Text style={styles.manualPin}>📍</Text>
                    <TextInput
                      style={[styles.manualInput, { color: colors.text }]}
                      value={manualAddress}
                      onChangeText={setManualAddress}
                      placeholder="e.g. Eiffel Tower, Paris, France"
                      placeholderTextColor={colors.textTertiary}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleConfirmManual}
                      maxLength={200}
                    />
                    {manualAddress.trim().length > 0 && (
                      <TouchableOpacity
                        onPress={handleConfirmManual}
                        style={[styles.confirmBtn, { backgroundColor: colors.accent }]}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm manual address"
                      >
                        <Text style={styles.confirmBtnText}>✓</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Auto-detected address */}
              {!isFetchingLocation && !isManualMode && draft.address && (
                <View style={styles.detectedRow}>
                  <Text style={[styles.detectedAddress, { color: colors.text }]}>
                    {draft.address}
                  </Text>
                  {draft.latitude !== null && draft.longitude !== null && (
                    <Text style={[styles.detectedCoords, { color: colors.textTertiary }]}>
                      {draft.latitude.toFixed(5)}°,  {draft.longitude.toFixed(5)}°
                    </Text>
                  )}
                </View>
              )}

              {/* Confirmed manual address */}
              {!isFetchingLocation && !isManualMode && draft.address && locationDenied && (
                <View style={[styles.manualConfirmedBadge, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                  <Text style={[styles.manualConfirmedText, { color: colors.textTertiary }]}>
                    ✏️ Entered manually
                  </Text>
                </View>
              )}

              {/* Empty state message */}
              {!isFetchingLocation && !draft.address && !isManualMode && (
                <Text style={[styles.noAddressText, { color: colors.textTertiary }]}>
                  Waiting for location data…
                </Text>
              )}
            </Animated.View>
          )}

          {/* Steps hint — shown when no photo */}
          {!draft.imageUri && (
            <View style={styles.stepsRow}>
              {[
                { num: '01', label: 'Take a photo' },
                { num: '02', label: 'Get location' },
                { num: '03', label: 'Save & notify' },
              ].map((s, i) => (
                <View key={i} style={[styles.step, { borderColor: colors.border }]}>
                  <Text style={[styles.stepNum, { color: colors.accent }]}>{s.num}</Text>
                  <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* ── Save button ──────────────────────────────────────────────── */}
        {draft.imageUri && (
          <Animated.View
            style={[
              styles.saveWrap,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.borderLight,
                paddingBottom: insets.bottom + SPACING.sm,
                transform: [{ scale: saveScale }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: canSave ? colors.accent : colors.surfaceElevated },
              ]}
              onPress={handleSave}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityLabel="Save travel entry"
            >
              {isSaving ? (
                <ActivityIndicator color={canSave ? '#000' : colors.textTertiary} />
              ) : (
                <Text
                  style={[
                    styles.saveBtnText,
                    { color: canSave ? '#000' : colors.textTertiary },
                  ]}
                >
                  {isFetchingLocation ? 'Detecting Location…' : isManualMode ? 'Enter Location First' : 'Save Memory'}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddEntryScreen;
