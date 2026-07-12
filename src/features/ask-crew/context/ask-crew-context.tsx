import { createContext, PropsWithChildren, useContext, useMemo, useRef } from 'react';

type AskCrewControls = {
  present: () => void;
  dismiss: () => void;
};

const AskCrewContext = createContext<AskCrewControls | null>(null);

/**
 * Holds the imperative present/dismiss handlers for the always-mounted Ask Crew sheet.
 * The sheet itself (Phase 5) registers its handlers here so the FAB can trigger it
 * without the feed screen ever conditionally rendering the sheet.
 */
export function AskCrewProvider({ children }: PropsWithChildren) {
  const controlsRef = useRef<AskCrewControls>({ present: () => {}, dismiss: () => {} });

  const controls = useMemo<AskCrewControls>(
    () => ({
      present: () => controlsRef.current.present(),
      dismiss: () => controlsRef.current.dismiss(),
    }),
    []
  );

  return (
    <AskCrewContext.Provider value={controls}>
      <AskCrewRegistryContext.Provider value={controlsRef}>
        {children}
      </AskCrewRegistryContext.Provider>
    </AskCrewContext.Provider>
  );
}

const AskCrewRegistryContext = createContext<React.MutableRefObject<AskCrewControls> | null>(
  null
);

/** Used by the FAB (and anything else) to open/close the sheet. */
export function useAskCrew() {
  const context = useContext(AskCrewContext);
  if (!context) throw new Error('useAskCrew must be used within AskCrewProvider');
  return context;
}

/** Used once by ask-crew-sheet.tsx to register its real present/dismiss implementation. */
export function useAskCrewRegistry() {
  const context = useContext(AskCrewRegistryContext);
  if (!context) throw new Error('useAskCrewRegistry must be used within AskCrewProvider');
  return context;
}
