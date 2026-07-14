import { BottomSheetTextInput } from '@expo/ui/community/bottom-sheet';
import { Pressable, View } from 'react-native';

import { SendIcon } from '@/components/chat/send-icon';
import { colors } from '@/constants/design-tokens';

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export function ChatInputBar({ value, onChangeText, onSend, disabled }: ChatInputBarProps) {
  return (
    <View className="h-14 flex-row items-center gap-2 border-t border-border bg-surface px-4">
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        returnKeyType="send"
        placeholder="Ask about your trip…"
        placeholderTextColor={colors.textTertiary}
        style={inputStyle}
      />
      <Pressable
        onPress={onSend}
        disabled={disabled}
        className="h-9 w-9 items-center justify-center rounded-full bg-accent"
        style={disabled ? { opacity: 0.5 } : undefined}
      >
        <SendIcon />
      </Pressable>
    </View>
  );
}

const inputStyle = {
  flex: 1,
  height: 40,
  backgroundColor: colors.surfaceMuted,
  borderRadius: 20,
  paddingHorizontal: 14,
  fontSize: 15,
  lineHeight: 15 * 1.4,
  color: colors.textPrimary,
};
