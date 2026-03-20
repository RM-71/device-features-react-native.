import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const styles = StyleSheet.create({
  outer: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  photoWrap: { height: 200, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  deleteBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteBtnX: { color: '#fff', fontSize: 11, fontWeight: '800' },
  datePill: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  datePillText: { color: '#fff', fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },

  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  infoLeft: { flex: 1, gap: 4 },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pinDot: { width: 7, height: 7, borderRadius: 4 },
  addressText: { ...TYPOGRAPHY.titleSmall, flex: 1 },
  dateText: { ...TYPOGRAPHY.labelMedium, marginLeft: 13 },
  coordsBox: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minWidth: 64,
  },
  coordsLat: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  coordsLon: { fontSize: 10, fontWeight: '500', marginTop: 1 },
});

export default styles;
