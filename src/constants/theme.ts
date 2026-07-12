/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',

    primary: '#0A84FF',
    onPrimary: '#ffffff',
    cardBorder: '#E5E6EA',
    ratingStar: '#F5A623',

    badgeFlightStay: '#E4EEFF',
    badgeFlightStayText: '#0A57C2',
    badgeVilla: '#E9F7EE',
    badgeVillaText: '#1C8A4B',
    badgeExperience: '#FBEAE0',
    badgeExperienceText: '#C1541F',

    bubbleUser: '#0A84FF',
    bubbleUserText: '#ffffff',
    bubbleAssistant: '#F0F0F3',
    bubbleAssistantText: '#000000',

    overlayBackground: 'rgba(20, 20, 24, 0.85)',
    overlayText: '#ffffff',
    statusGood: '#34C759',
    statusWarning: '#F5A623',
    statusDanger: '#FF3B30',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',

    primary: '#3C9FFE',
    onPrimary: '#ffffff',
    cardBorder: '#2E3135',
    ratingStar: '#F5A623',

    badgeFlightStay: '#173157',
    badgeFlightStayText: '#8FC1FF',
    badgeVilla: '#123822',
    badgeVillaText: '#7EDBA3',
    badgeExperience: '#3C2415',
    badgeExperienceText: '#F5B48A',

    bubbleUser: '#3C9FFE',
    bubbleUserText: '#ffffff',
    bubbleAssistant: '#212225',
    bubbleAssistantText: '#ffffff',

    overlayBackground: 'rgba(20, 20, 24, 0.85)',
    overlayText: '#ffffff',
    statusGood: '#34C759',
    statusWarning: '#F5A623',
    statusDanger: '#FF3B30',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
