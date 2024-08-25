"use client";

import { formatCompletionTime } from "@/util/formatting";
import { fetchActions } from "./../server/actions";
import styles from "./../css/ActionList.module.css";
import { useEffect, useState } from "react";
import { Action } from "@/interfaces/action";
import Button from "./Button";

export default function ActionList() {
  const [actions, setActions] = useState(null as null | Action[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActions().then((data: Action[]) => {
      setActions(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {!isLoading &&
        actions &&
        actions.map((action) => (
          <div key={action.action_id}>
            <div className={styles.actionContainer}>
              <div className={styles.actionContainerGrid}>
                <div className={styles.actionName}>{action.action_name}</div>
                <div className={styles.actionDetailsContainer}>
                  <div className={styles.buttonContainer}>
                    <Button
                      iconName="check_circle"
                      classNames={[styles.completeButton]}
                    />
                    {action.scheduling?.time_minutes && (
                      <Button
                        iconName="timer_play"
                        classNames={[styles.timerButton]}
                      />
                    )}
                  </div>
                  {action.scheduling?.time_minutes > 0 && (
                    <>
                      <span className={styles.actionTime}>
                        {formatCompletionTime(action.scheduling.time_minutes)}
                      </span>
                      <span className={styles.dotSymbol}>•</span>
                    </>
                  )}
                  {action.tags &&
                    action.tags.map((tag) => (
                      <div className={styles.tag} key={tag}>
                        #{tag}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
