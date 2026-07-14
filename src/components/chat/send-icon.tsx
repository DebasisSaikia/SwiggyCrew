import { Ionicons } from '@expo/vector-icons';

// @expo/vector-icons per CLAUDE.md's iconography convention (raw
// react-native-svg is what the rest of this file's history was, before the
// sheet moved off @expo/ui's bottom sheet entirely — see ask-crew-sheet.tsx).
export function SendIcon() {
  return <Ionicons name="arrow-up" size={18} color="#FFFFFF" />;
}
