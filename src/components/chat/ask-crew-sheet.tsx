import { BottomSheetModal, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useEffect, useMemo, useRef } from 'react';

import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { SheetHeader } from '@/components/chat/sheet-header';
import { colors } from '@/constants/design-tokens';
import { useAskCrewChat } from '@/hooks/use-ask-crew-chat';
import { useChatStore } from '@/store/chat-store';
import { useFeedStore } from '@/store/feed-store';

const SNAP_POINTS = ['50%', '92%'];

/**
 * Subscribes to feedStore.isSheetOpen itself so opening/closing this sheet
 * never re-renders FeedList (CLAUDE.md non-negotiable rule #4) — the parent
 * screen only ever calls the openSheet() action, it never reads the flag.
 *
 * Uses @expo/ui's native BottomSheet (Material3 ModalBottomSheet on Android,
 * SwiftUI sheet on iOS) instead of @gorhom/bottom-sheet — the gorhom sheet's
 * present() call succeeded silently but never actually animated/rendered on
 * a real Android dev client (onChange/onAnimate never fired even in gorhom's
 * own bare-minimum example), a currently-unresolved issue in their repo.
 * @expo/ui's API is deliberately gorhom-compatible, so this is a near-drop-in
 * swap. Trade-off: native handle/corner-radius styling instead of pixel-exact
 * design-doc values, since these are real native sheets, not custom-drawn.
 *
 * KNOWN ISSUE (deferred): on Android, ChatInputBar doesn't appear until the
 * sheet is fully expanded (92%) — invisible at the partial (50%) snap
 * point. A custom Modal + Animated + PanResponder + ScrollView replacement
 * was attempted and got further (fixed the sheet not presenting at all,
 * and a separate Reanimated/secondary-Fabric-surface crash) but hit a
 * still-unexplained bug where any scrollable sibling (FlatList OR
 * ScrollView) prevents ChatInputBar from rendering at all, regardless of
 * sibling order, absolute positioning, elevation, or overflow settings —
 * and the position/layout changes made while chasing that broke iOS too.
 * Reverted back to this @expo/ui version rather than ship something broken
 * on both platforms. To be revisited.
 */
export function AskCrewSheet() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const isSheetOpen = useFeedStore((state) => state.isSheetOpen);
  const closeSheet = useFeedStore((state) => state.closeSheet);
  const setSnapIndex = useChatStore((state) => state.setSnapIndex);
  const { messages, inputValue, setInputValue, handleSend, isStreaming } = useAskCrewChat();

  useEffect(() => {
    if (isSheetOpen) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isSheetOpen]);

  const handleSheetChange = (index: number) => {
    if (index >= 0) setSnapIndex(index as 0 | 1);
  };

  const backgroundStyle = useMemo(() => ({ backgroundColor: colors.surface }), []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onDismiss={closeSheet}
      onChange={handleSheetChange}
      backgroundStyle={backgroundStyle}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <SheetHeader onMinimize={closeSheet} />
        <ChatMessageList messages={messages} />
        <ChatInputBar value={inputValue} onChangeText={setInputValue} onSend={handleSend} disabled={isStreaming} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
