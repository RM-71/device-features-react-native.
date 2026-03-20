import React, { useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StatusBar, Animated, ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';

import { TravelEntry, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDiary } from '../context/DiaryContext';
import { SPACING } from '../constants/theme';
import EntryCard from '../components/EntryCard';
import EmptyState from '../components/EmptyState';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/screens/HomeScreen.styles';

type NavProp = StackNavigationProp<RootStackParamList, 'Home'>;
const BRAND_ICON = require('../../assets/adaptive-icon.png');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const { entries, isLoading } = useDiary();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  // Header shrink on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleAdd = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
    ]).start();
    navigation.navigate('AddEntry');
  };

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<TravelEntry>) => (
      <EntryCard entry={item} index={index} />
    ),
    []
  );

  const keyExtractor = useCallback((item: TravelEntry) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={styles.topLeft}>
          <View style={[styles.logoMark, { borderColor: colors.border }]}>
            <Image source={BRAND_ICON} style={styles.logoImage} resizeMode="cover" />
          </View>
          <View>
            <Text style={[styles.appName, { color: colors.text }]}>Travelogue</Text>
            <Text style={[styles.appSub, { color: colors.textTertiary }]}>
              {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
            </Text>
          </View>
        </View>
        <ThemeToggle />
      </View>

      {/* ── List ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <LoadingSpinner size={36} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading memories…
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={entries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <View style={[styles.heroSection, { paddingHorizontal: SPACING.lg }]}>
                <Text style={[styles.heroTitle, { color: colors.text }]}>Your</Text>
                <Text style={[styles.heroTitleAccent, { color: colors.accent }]}>Adventures.</Text>
              </View>
              <View style={[styles.dividerRow, { paddingHorizontal: SPACING.lg }]}>
                <View style={[styles.dividerLine, { backgroundColor: colors.accent }]} />
                <View style={[styles.dividerLineFaint, { backgroundColor: colors.border }]} />
              </View>
            </View>
          }
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.fabWrap,
          { bottom: insets.bottom + SPACING.lg, transform: [{ scale: fabScale }] },
        ]}
      >
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={handleAdd}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Add new travel entry"
        >
          <Text style={styles.fabIcon}>＋</Text>
          <Text style={styles.fabText}>New Memory</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
