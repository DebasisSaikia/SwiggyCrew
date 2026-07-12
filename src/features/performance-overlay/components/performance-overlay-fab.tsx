import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PerformanceOverlayFabProps = {
  bottomOffset: number;
  active: boolean;
  onToggle: () => void;
};

export function PerformanceOverlayFab({ bottomOffset, active, onToggle }: PerformanceOverlayFabProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle performance overlay"
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: active ? theme.text : theme.backgroundElement,
          bottom: bottomOffset,
          borderColor: theme.cardBorder,
        },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name={{ ios: 'speedometer', android: 'speed', web: 'speed' }}
        size={20}
        tintColor={active ? theme.background : theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: Spacing.four,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
  },
});
