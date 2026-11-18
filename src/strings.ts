/** Every word the kit shows. Override any of them with `strings` on createThemeKit. */
export const DEFAULT_STRINGS = {
  title: 'Appearance',
  system: 'System',
  systemDetail: 'Follows your phone (light by day, dark at night if you set that)',
  light: 'Light',
  lightDetail: 'Always light',
  dark: 'Dark',
  darkDetail: 'Always dark',
  note: '',
};
export type ThemeStrings = typeof DEFAULT_STRINGS;
