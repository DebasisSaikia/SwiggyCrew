import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useAskCrew } from '../context/ask-crew-context';

type AskCrewFabProps = { bottomOffset: number };

export function AskCrewFab({ bottomOffset }: AskCrewFabProps) {
  const theme = useTheme();
  const { present } = useAskCrew();

  return (
    <Pressable
      onPress={present}
      accessibilityRole="button"
      accessibilityLabel="Ask Crew"
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: theme.primary, bottom: bottomOffset },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
        size={22}
        tintColor={theme.onPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
  },
});
