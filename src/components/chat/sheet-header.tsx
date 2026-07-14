import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/design-tokens';

interface SheetHeaderProps {
  onMinimize: () => void;
}

// Uses @expo/vector-icons, not the shared Reanimated-driven ChevronIcon
// (this chevron never actually expands/collapses — it's always the
// "minimize" affordance) — matches CLAUDE.md's iconography convention.
export function SheetHeader({ onMinimize }: SheetHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-crew-heading text-primary">Ask Crew</Text>
        <Pressable onPress={onMinimize} className="h-7 w-7 items-center justify-center">
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
      <View className="h-px w-full bg-border" />
    </View>
  );
}
