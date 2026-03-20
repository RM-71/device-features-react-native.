import React, { useRef, useEffect } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/components/LoadingSpinner.styles';

interface Props { size?: number; style?: ViewStyle; }

const LoadingSpinner: React.FC<Props> = ({ size = 32, style }) => {
  const { theme } = useTheme();
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 900, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={[styles.wrap, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.colors.border,
            borderTopColor: theme.colors.accent,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
};

export default LoadingSpinner;
