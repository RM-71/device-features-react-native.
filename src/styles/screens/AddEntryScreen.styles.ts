import { Dimensions, StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const { height: SH } = Dimensions.get('window');
const PHOTO_H = SH * 0.38;

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  backBtn: {},
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 18, lineHeight: 20 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.titleMedium },
  headerSub: { ...TYPOGRAPHY.labelMedium, marginTop: 1 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.lg, gap: SPACING.md },

  // Photo
  photoWrap: {
    height: PHOTO_H,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: { width: '100%', height: '100%' },
  retakeBtn: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  retakeIcon: { fontSize: 14 },
  retakeLabel: { color: '#fff', ...TYPOGRAPHY.labelLarge },

  // Placeholder
  photoPlaceholder: {
    height: PHOTO_H,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  cameraIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraEmoji: { fontSize: 36 },
  cameraHeading: { ...TYPOGRAPHY.titleMedium },
  cameraSub: { ...TYPOGRAPHY.bodySmall },

  // Location card
  locationCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationCardTitle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  locDot: { width: 8, height: 8, borderRadius: 4 },
  locationLabel: { ...TYPOGRAPHY.titleSmall },
  locationActions: { flexDirection: 'row', gap: SPACING.sm },
  actionChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  actionChipText: { ...TYPOGRAPHY.labelLarge },

  // Fetching
  fetchingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  fetchingText: { ...TYPOGRAPHY.bodySmall },

  // Manual input
  manualWrap: { gap: SPACING.sm },
  manualHint: { ...TYPOGRAPHY.bodySmall, lineHeight: 18 },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  manualPin: { fontSize: 16 },
  manualInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    paddingVertical: 4,
  },
  confirmBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },

  // Detected address
  detectedRow: { gap: 4 },
  detectedAddress: { ...TYPOGRAPHY.bodyMedium, lineHeight: 22 },
  detectedCoords: { ...TYPOGRAPHY.labelMedium },
  manualConfirmedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  manualConfirmedText: { ...TYPOGRAPHY.labelMedium },
  noAddressText: { ...TYPOGRAPHY.bodySmall },

  // Steps
  stepsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  step: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.xs,
    alignItems: 'center',
  },
  stepNum: { ...TYPOGRAPHY.displaySmall },
  stepLabel: { ...TYPOGRAPHY.labelMedium, textAlign: 'center' },

  // Save
  saveWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    borderRadius: RADIUS.round,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { ...TYPOGRAPHY.titleSmall, letterSpacing: 0.2 },
});

export default styles;
