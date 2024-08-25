const MINUTES_IN_HOUR = 60;

const formatCompletionTime = (time_minutes: number) => {
  const minutes_remainder = time_minutes % MINUTES_IN_HOUR;
  const hours = Math.floor(time_minutes / MINUTES_IN_HOUR);
  if (hours > 0) {
    if (minutes_remainder > 0) {
      return `${hours}h${minutes_remainder}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    return `${minutes_remainder}m`;
  }
};

export { formatCompletionTime };
