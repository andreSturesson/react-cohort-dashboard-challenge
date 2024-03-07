import { atom } from "jotai";

let theme = localStorage.getItem("mantine-color-scheme-value") || "dark";

export let isDarkThemeAtom;

if (theme === "dark") {
  isDarkThemeAtom = atom(true);
} else {
  isDarkThemeAtom = atom(false);
}

export const themeAtom = atom(theme, (_get, set, newTheme) => {
  if (newTheme === theme) {
    // Toggle the theme
    newTheme = theme === "dark" ? "light" : "dark";
  }
  set(themeAtom, newTheme);
  localStorage.setItem("mantine-color-scheme-value", newTheme);
});
