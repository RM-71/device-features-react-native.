import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Alert, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { TravelEntry } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDiary } from '../context/DiaryContext';
import { formatDate, formatTime, getRelativeDate } from '../utils/dateFormat';
import { validateEntryId } from '../utils/validation';
import styles from '../styles/components/EntryCard.styles';

interface Props { entry: TravelEntry; index: number; }

const EntryCard: React.FC<Props> = ({ entry, index }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { removeEntry } = useDiary();
  const [isDeleting, setIsDeleting] = useState(false);

  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 9 }),
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleRemove = (): void => {
    const v = validateEntryId(entry.id);
    if (!v.isValid) { Alert.alert('Error', v.message); return; }

    Alert.alert(
      'Delete Memory',
      `Remove "${entry.address}"?\nThis cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setIsDeleting(true);
              Animated.parallel([
                Animated.timing(scale, { toValue: 0.88, duration: 180, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
              ]).start(async () => { await removeEntry(entry.id); });
            } catch {
              setIsDeleting(false);
              Alert.alert('Error', 'Failed to remove entry.');
            }
          },
        },
      ]
    );
  };

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, tension: 200, friction: 12 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();

  const relDate = getRelativeDate(entry.createdAt);
  const fullDate = formatDate(entry.createdAt);
  const time = formatTime(entry.createdAt);

  return (
    <Animated.View
      style={[
        styles.outer,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {/* Full-bleed photo */}
        <View style={styles.photoWrap}>
          <Image source={{ uri: entry.imageUri }} style={styles.photo} resizeMode="cover" />

          {/* Gradient scrim */}
          <View style={styles.scrim} />

          {/* Top-right remove button */}
          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: colors.destructive }]}
            onPress={handleRemove}
            disabled={isDeleting}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Delete entry"
          >
            <Text style={styles.deleteBtnX}>✕</Text>
          </TouchableOpacity>

          {/* Date pill top-left */}
          <View style={[styles.datePill, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
            <Text style={styles.datePillText}>{relDate}</Text>
          </View>
        </View>

        {/* Info strip */}
        <View style={[styles.infoStrip, { backgroundColor: colors.card }]}>
          {/* Left: address */}
          <View style={styles.infoLeft}>
            <View style={styles.pinRow}>
              <View style={[styles.pinDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={1}>
                {entry.address}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textTertiary }]}>
              {fullDate} · {time}
            </Text>
          </View>

          {/* Right: coords */}
          <View style={[styles.coordsBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Text style={[styles.coordsLat, { color: colors.accent }]}>
              {entry.latitude.toFixed(3)}°
            </Text>
            <Text style={[styles.coordsLon, { color: colors.textTertiary }]}>
              {entry.longitude.toFixed(3)}°
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default EntryCard;
