import React, { useEffect, useState } from "react";
import { Query, QuerySchema } from "../interfaces/query";
import { parseQueryInputSpec } from "../core/input-parsing/query-parsing";
import { ParseResult } from "../core/input-parsing/spec-parsing";
import { combineClasses, SOURCE_CODE_PRO } from "../core/styling/css";
import { callbackOnEnter } from "../core/styling/jsx-util";
import styles from "@/app/css/QueryInput.module.css";

export interface QueryInputProps {
  callback: (q: Query) => void;
  saveQuery: (queryName: string) => void;
  cancel: () => void;
}

const convertInputSpecToQueryOrError = (
  inputSpec: string
): [Query | undefined, string | undefined] => {
  const parsedQuerySpec: ParseResult<Query> = parseQueryInputSpec(inputSpec);
  let query = undefined as Query | undefined;
  let errorMessage = undefined as string | undefined;
  if (!parsedQuerySpec.any_error && parsedQuerySpec.partial_result) {
    const partialQuery = parsedQuerySpec.partial_result;
    try {
      partialQuery.creation_spec = inputSpec;
      query = QuerySchema.parse(partialQuery);
    } catch (e) {
      errorMessage = "Something's wrong with your syntax.";
    }
  } else {
    errorMessage = parsedQuerySpec.input_spec_parts.find(
      (part) => part.error
    )?.error;
  }
  return [query, errorMessage];
};

export default function QueryInput(props: QueryInputProps) {
  const [inputSpec, setInputSpec] = useState("");
  const [queryName, setQueryName] = useState("");
  const [isShowingQueryName, setIsShowingQueryName] = useState(false);

  const [query, errorMessage] = convertInputSpecToQueryOrError(inputSpec);

  const handleQuerySpecEnter = () => {
    if (query) {
      setIsShowingQueryName(true);
    }
  };

  const handleQueryNameEnter = () => {
    if (query && queryName) {
      props.saveQuery(queryName);
    }
  };

  useEffect(() => {
    if (query) {
      props.callback(query);
    }
  }, [inputSpec]);

  const SPEC_PLACEHOLDER_TEXT = "query";
  const NAME_PLACEHOLDER_TEXT = "name";

  return (
    <div className={styles.queryInputAndNamingContainer}>
      <input
        className={combineClasses(
          styles.inputBox,
          SOURCE_CODE_PRO.className,
          errorMessage && inputSpec.length > 0 && styles.inputError,
          isShowingQueryName && styles.hideUnderline
        )}
        placeholder={SPEC_PLACEHOLDER_TEXT}
        value={inputSpec}
        onChange={(e) => setInputSpec(e.target.value)}
        onKeyDown={(e) => callbackOnEnter(e, handleQuerySpecEnter, true)}
        size={Math.max(
          inputSpec.length,
          isShowingQueryName ? 0 : SPEC_PLACEHOLDER_TEXT.length
        )}
        autoFocus
      />
      {isShowingQueryName && (
        <>
          <span className={styles.bulletPoint}>•</span>
          <input
            className={combineClasses(
              styles.inputBox,
              SOURCE_CODE_PRO.className
            )}
            placeholder={NAME_PLACEHOLDER_TEXT}
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            onKeyDown={(e) => callbackOnEnter(e, handleQueryNameEnter, true)}
            size={Math.max(queryName.length, NAME_PLACEHOLDER_TEXT.length)}
            autoFocus
          />
        </>
      )}
    </div>
  );
}
