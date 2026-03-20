import { StyleSheet } from 'react-native';
import { RADIUS } from '../../constants/theme';

const styles = StyleSheet.create({
  track: {
    width: 54,
    height: 30,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  thumbIcon: { fontSize: 12 },
});

export default styles;
