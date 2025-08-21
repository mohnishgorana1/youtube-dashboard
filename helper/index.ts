export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.MAX_SAFE_INTEGER, "year"],
  ];

  let counter = seconds;
  for (let i = 0; i < intervals.length; i++) {
    if (counter < intervals[i][0]) {
      const unit = intervals[i][1];
      return `${counter} ${unit}${counter > 1 ? "s" : ""} ago`;
    }
    counter = Math.floor(counter / intervals[i][0]);
  }

  return "just now";
}

export function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}
