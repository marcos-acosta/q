type MaybeString = string | null | undefined | boolean;

const combineClasses = (...classNames: MaybeString[]) =>
  [...classNames].filter(Boolean).join(" ");

export { combineClasses };
