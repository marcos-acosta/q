import { Fragment, ReactNode } from "react";

export const joinNodes = (sections: ReactNode[], delimiter: ReactNode) => {
  return (
    <>
      {sections.map((section, index) => (
        <Fragment key={index}>
          {!!index && delimiter}
          {section}
        </Fragment>
      ))}
    </>
  );
};

export const callbackOnEnter = (
  event: React.KeyboardEvent,
  callbackFn: () => void
) => {
  if (event.key === "Enter") {
    callbackFn();
  }
};

export const andStopPropagate = (
  event: React.MouseEvent,
  callbackFn?: () => void
) => {
  event.stopPropagation();
  if (callbackFn) {
    callbackFn();
  }
};
