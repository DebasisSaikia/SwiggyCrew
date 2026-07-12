import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled: boolean;
};

// BottomSheetTextInput calls a legacy native-only TextInput.State API to track
// keyboard focus for the sheet's keyboard-avoiding behavior; react-native-web's
// TextInput shim doesn't implement it and throws. Keyboard "avoidance" isn't a
// native-parity concept on web anyway, so a plain TextInput there is correct,
// not just a workaround.
const Input = Platform.OS === 'web' ? TextInput : BottomSheetTextInput;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const theme = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
      ]}>
      <Input
        value={text}
        onChangeText={setText}
        placeholder="Ask Crew about your trip..."
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
        multiline
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        style={({ pressed }) => [
          styles.sendButton,
          { backgroundColor: canSend ? theme.primary : theme.cardBorder },
          pressed && canSend && styles.pressed,
        ]}>
        <SymbolView
          name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
          size={16}
          weight="bold"
          tintColor={canSend ? theme.onPrimary : theme.textSecondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    paddingVertical: Spacing.one,
    marginHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 100,
    paddingVertical: Spacing.two,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
