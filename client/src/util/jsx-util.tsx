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
