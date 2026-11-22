import Feather from '@expo/vector-icons/Feather';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text as RNText, useColorScheme, View, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import { isThemeChoice, pickLook, type ThemeChoice } from './choice';
import type { BaseTokens } from './palette';
import { kitThemes } from './kitThemes';
import { DEFAULT_STRINGS, type ThemeStrings } from './strings';

/** Where the choice is kept (AsyncStorage fits). Leave it out and the choice lasts until the app closes. */
export interface ThemeStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

export interface ThemeKitOptions<P extends BaseTokens> {
  /** The app's full light and dark palettes (start from makePalettes and add the app's own colours). */
  light: P;
  dark: P;
  storage?: ThemeStorage;
  /** Default 'app-theme-kit.choice'. */
  storageKey?: string;
  /** Before anything is saved. Default 'system'. */
  initial?: ThemeChoice;
  strings?: Partial<ThemeStrings>;
  /** The app's own Text (for its font). Default React Native's Text. */
  components?: { Text?: ComponentType<TextProps> };
}

/**
 * Makes the theme for one app: `ThemeProvider` (wrap the app), `usePalette()` (the colours now), `useThemeChoice()`
 * (System / Light / Dark and a setter) and `AppearancePage` (the ready Settings page: three rows, tick on the chosen one).
 */
export function createThemeKit<P extends BaseTokens>(options: ThemeKitOptions<P>) {
  const { light, dark, storage, storageKey = 'app-theme-kit.choice', initial = 'system' } = options;
  const strings: ThemeStrings = { ...DEFAULT_STRINGS, ...options.strings };
  const Text = options.components?.Text ?? RNText;
  const PaletteContext = createContext<P>(light);
  const ChoiceContext = createContext<{ choice: ThemeChoice; setChoice: (c: ThemeChoice) => void }>({ choice: initial, setChoice: () => {} });

  function ThemeProvider({ children }: { children: ReactNode }) {
    const phone = useColorScheme();
    const [choice, setState] = useState<ThemeChoice>(initial);
    useEffect(() => {
      storage
        ?.getItem(storageKey)
        .then((v) => {
          if (isThemeChoice(v)) setState(v);
        })
        .catch(() => {});
    }, []);
    const setChoice = useCallback((c: ThemeChoice) => {
      setState(c);
      storage?.setItem(storageKey, c).catch(() => {});
    }, []);
    const look = pickLook(choice, phone === 'dark' || phone === 'light' ? phone : null);
    const chosen = useMemo(() => ({ choice, setChoice }), [choice, setChoice]);
    return (
      <ChoiceContext.Provider value={chosen}>
        <PaletteContext.Provider value={look === 'dark' ? dark : light}>{children}</PaletteContext.Provider>
      </ChoiceContext.Provider>
    );
  }

  const usePalette = (): P => useContext(PaletteContext);
  const useThemeChoice = () => useContext(ChoiceContext);

  const CHOICES: { value: ThemeChoice; label: string; detail: string; icon: keyof typeof Feather.glyphMap }[] = [
    { value: 'system', label: strings.system, detail: strings.systemDetail, icon: 'smartphone' },
    { value: 'light', label: strings.light, detail: strings.lightDetail, icon: 'sun' },
    { value: 'dark', label: strings.dark, detail: strings.darkDetail, icon: 'moon' },
  ];
  /** "System", "Light" or "Dark", for a Settings row's value. */
  const choiceLabel = (c: ThemeChoice) => CHOICES.find((x) => x.value === c)?.label ?? strings.system;

  /**
   * The Appearance page body: a card of three rows (no pop-ups); tap one to choose it.
   * `cardStyle` (optional, nothing by default) is added to the card, e.g. an app's own border: { borderWidth, borderColor }.
   */
  function AppearancePage({ note = strings.note, cardStyle }: { note?: string; cardStyle?: StyleProp<ViewStyle> }) {
    const p = usePalette();
    const { choice, setChoice } = useThemeChoice();
    return (
      <>
        <View style={[styles.card, { backgroundColor: p.card }, cardStyle]} accessibilityRole="radiogroup" accessibilityLabel={strings.title}>
          {CHOICES.map((c, i) => {
            const on = choice === c.value;
            return (
              <Pressable
                key={c.value}
                onPress={() => setChoice(c.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${c.label}, ${c.detail}`}
                style={[styles.row, i < CHOICES.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: p.line }]}
              >
                <View style={[styles.icon, { backgroundColor: on ? p.accent : p.accentSoft }]}>
                  <Feather name={c.icon} size={17} color={on ? p.onAccent : p.accent} />
                </View>
                <View style={styles.words}>
                  <Text style={[styles.label, { color: p.text }]}>{c.label}</Text>
                  <Text style={[styles.detail, { color: p.muted }]}>{c.detail}</Text>
                </View>
                {on ? <Feather name="check" size={20} color={p.accent} /> : null}
              </Pressable>
            );
          })}
        </View>
        {note ? <Text style={[styles.note, { color: p.muted }]}>{note}</Text> : null}
      </>
    );
  }

  /** 1.2.0: every kit's theme made from the palette now (see `kitThemes`). */
  const useKitThemes = () => {
    const p = usePalette();
    return useMemo(() => kitThemes(p), [p]);
  };

  return { ThemeProvider, usePalette, useKitThemes, useThemeChoice, AppearancePage, choiceLabel, strings };
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 60 },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  words: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600' },
  detail: { fontSize: 12, marginTop: 2 },
  note: { fontSize: 13, marginTop: 10, marginHorizontal: 4, lineHeight: 18 },
});
