/** System (follow the phone), or always light, or always dark. */
export type ThemeChoice = 'system' | 'light' | 'dark';

export const isThemeChoice = (v: unknown): v is ThemeChoice => v === 'system' || v === 'light' || v === 'dark';

/** Which look to show for a choice, given what the phone is set to (null/undefined = unknown, shown light). */
export function pickLook(choice: ThemeChoice, phone: 'light' | 'dark' | null | undefined): 'light' | 'dark' {
  if (choice === 'system') return phone === 'dark' ? 'dark' : 'light';
  return choice;
}
