import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { ElementRef, useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useAskCrewRegistry } from '../context/ask-crew-context';
import { useChatStore } from '../store/chat-store';
import { ChatInput } from './chat-input';
import { ChatMessageList } from './chat-message-list';

const SNAP_POINTS = ['50%', '100%'];

export function AskCrewSheet() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<ElementRef<typeof BottomSheetModal>>(null);
  const registryRef = useAskCrewRegistry();

  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const sendMessage = useChatStore((state) => state.sendMessage);

  useEffect(() => {
    registryRef.current = {
      present: () => sheetRef.current?.present(),
      dismiss: () => sheetRef.current?.dismiss(),
    };
  }, [registryRef]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleClose = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter {...footerProps} bottomInset={insets.bottom}>
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </BottomSheetFooter>
    ),
    [handleSend, insets.bottom, isStreaming]
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      index={0}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: theme.background }}
      handleIndicatorStyle={{ backgroundColor: theme.cardBorder }}
      footerComponent={renderFooter}>
      <BottomSheetView style={styles.header}>
        <ThemedText type="smallBold">Ask Crew</ThemedText>
        <Pressable
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close Ask Crew"
          hitSlop={8}>
          <View style={[styles.closeButton, { backgroundColor: theme.backgroundElement }]}>
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              size={13}
              weight="bold"
              tintColor={theme.textSecondary}
            />
          </View>
        </Pressable>
      </BottomSheetView>
      <ChatMessageList messages={messages} />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  closeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
