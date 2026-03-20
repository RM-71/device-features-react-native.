import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/components/EmptyState.styles';

const EmptyState: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  const fade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 45, friction: 8 }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -14, duration: 2200, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fade, transform: [{ scale }] }]}>
      {/* Big decorative ring */}
      <View style={[styles.ring, { borderColor: colors.border }]}>
        <View style={[styles.ringInner, { borderColor: colors.accent, opacity: 0.3 }]} />
        <Animated.Text style={[styles.plane, { transform: [{ translateY: float }] }]}>
          ✈️
        </Animated.Text>
      </View>

      <Text style={[styles.headline, { color: colors.text }]}>
        No Entries Yet
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Every adventure starts with a single photo.{'\n'}Tap below to capture your first memory.
      </Text>

      {/* Feature hints */}
      <View style={styles.hints}>
        {[
          { icon: '📷', label: 'Take a photo' },
          { icon: '📍', label: 'Auto location' },
          { icon: '🔔', label: 'Get notified' },
        ].map((h, i) => (
          <View key={i} style={[styles.hint, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Text style={styles.hintIcon}>{h.icon}</Text>
            <Text style={[styles.hintLabel, { color: colors.textSecondary }]}>{h.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default EmptyState;
