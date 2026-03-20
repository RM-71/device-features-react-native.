import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/components/ThemeToggle.styles';

interface Props { style?: ViewStyle; }

const ThemeToggle: React.FC<Props> = ({ style }) => {
  const { isDark, toggleTheme, theme } = useTheme();
  const { colors } = theme;

  const slide = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const glow = useRef(new Animated.Value(isDark ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: isDark ? 0 : 1, useNativeDriver: true, tension: 70, friction: 9 }),
      Animated.timing(glow, { toValue: isDark ? 0 : 1, duration: 250, useNativeDriver: false }),
    ]).start();
  }, [isDark]);

  const handleToggle = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const thumbX = slide.interpolate({ inputRange: [0, 1], outputRange: [3, 25] });
  const trackBg = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceElevated, colors.accent],
  });

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.9}
      accessibilityRole="switch"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={style}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackBg, borderColor: colors.border },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: isDark ? colors.accent : '#000',
              transform: [{ translateX: thumbX }],
            },
          ]}
        >
          <Animated.Text style={styles.thumbIcon}>
            {isDark ? '🌙' : '☀️'}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;
