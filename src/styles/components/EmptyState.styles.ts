import { StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    gap: SPACING.lg,
    minHeight: 500,
  },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  plane: { fontSize: 60 },
  headline: { ...TYPOGRAPHY.displaySmall, textAlign: 'center' },
  body: { ...TYPOGRAPHY.bodyLarge, textAlign: 'center', lineHeight: 26 },
  hints: { flexDirection: 'row', gap: SPACING.sm },
  hint: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  hintIcon: { fontSize: 22 },
  hintLabel: { ...TYPOGRAPHY.labelMedium, textAlign: 'center' },
});

export default styles;
