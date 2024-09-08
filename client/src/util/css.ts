import { Manrope, Source_Code_Pro } from "next/font/google";

type MaybeString = string | null | undefined | boolean;

export const THEME_COLORS = {
  black: "#2e2e2e",
};

export const TAG_COLORS = {
  CRIMSON: "#A4243B",
  ECRU: "#D8C99B",
  BUTTERSCOTCH: "#D8973C",
  ORANGE: "#BD632F",
  CHARCOAL: "#273E47",
};

export const MANROPE = Manrope({ weight: "500", subsets: ["latin"] });
export const SOURCE_CODE_PRO = Source_Code_Pro({
  weight: "400",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const hashString = (s: string): number => {
  let hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const combineClasses = (...classNames: MaybeString[]) =>
  [...classNames].filter(Boolean).join(" ");

export const tagToColor = (tag: string) => {
  return Object.values(TAG_COLORS)[
    hashString(tag) % Object.keys(TAG_COLORS).length
  ];
};
