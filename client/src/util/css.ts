import { Manrope, Source_Code_Pro } from "next/font/google";

type MaybeString = string | null | undefined | boolean;

export const THEME_COLORS = {
  black: "#2e2e2e",
};

export const MANROPE = Manrope({ weight: "500", subsets: ["latin"] });
export const SOURCE_CODE_PRO = Source_Code_Pro({
  weight: "400",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const combineClasses = (...classNames: MaybeString[]) =>
  [...classNames].filter(Boolean).join(" ");
