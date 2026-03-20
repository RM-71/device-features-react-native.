import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoChar: { color: '#000', fontSize: 18, fontWeight: '900' },
  appName: { ...TYPOGRAPHY.titleMedium },
  appSub: { ...TYPOGRAPHY.labelMedium, marginTop: 1 },

  heroSection: { paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  heroTitle: { ...TYPOGRAPHY.displayLarge },
  heroTitleAccent: { ...TYPOGRAPHY.displayLarge, marginTop: -8 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dividerLine: { width: 40, height: 3, borderRadius: 2 },
  dividerLineFaint: { flex: 1, height: 1, borderRadius: 1 },

  listContent: { paddingTop: SPACING.sm, flexGrow: 1 },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  loadingText: { ...TYPOGRAPHY.bodyMedium },

  fabWrap: { position: 'absolute', alignSelf: 'center' },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 16,
    borderRadius: RADIUS.round,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 14,
  },
  fabIcon: { color: '#000', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  fabText: { color: '#000', fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
});

export default styles;
