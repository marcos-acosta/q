import { Manrope, Source_Code_Pro } from "next/font/google";

type MaybeString = string | null | undefined | boolean;

export const THEME_COLORS = {
  black: "#2e2e2e",
};

export const TAG_COLORS = {
  GREEN: "#44AF69",
  RED: "#F8333C",
  YELLOW: "#FCAB10",
  BLUE: "#2B9EB3",
  PURPLE: "#B0A1BA",
};

// Fonts
export const MANROPE = Manrope({ weight: "500", subsets: ["latin"] });
export const SOURCE_CODE_PRO = Source_Code_Pro({
  weight: "400",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const hashString = (s: string): number => {
  if (!s.length) {
    return 0;
  }
  const firstChar = s.charCodeAt(0);
  if (s.length === 1) {
    return firstChar;
  }
  return firstChar + s.charCodeAt(1) - s.length;
};

export const combineClasses = (...classNames: MaybeString[]) =>
  [...classNames].filter(Boolean).join(" ");

export const tagToColor = (tag: string) => {
  return Object.values(TAG_COLORS)[
    hashString(tag) % Object.keys(TAG_COLORS).length
  ];
};

export const capitalize = (text: string) => {
  if (text.length === 0) {
    return "";
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};
