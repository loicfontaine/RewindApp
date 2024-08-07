export function formatRFC3339(date: Date): String {
  const offsetMinutes = date.getTimezoneOffset();
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffsetMinutes / 60);
  const offsetRemainderMinutes = absOffsetMinutes % 60;

  const offsetSign = offsetMinutes <= 0 ? "+" : "-";
  const formattedOffset =
    offsetSign +
    String(offsetHours).padStart(2, "0") +
    ":" +
    String(offsetRemainderMinutes).padStart(2, "0");

  const isoString = date.toISOString();
  const rfc3339String = isoString.replace("Z", formattedOffset);

  return rfc3339String;
}

export function getFormattedHours(date: Date): String {
  return `${padWithZero(date.getHours())}:${padWithZero(date.getMinutes())}`;
}
function padWithZero(number: number): String {
  return number < 10 ? "0" + number : `${number}`;
}

export function getFormattedDurationFromDates(start: Date, end: Date): String {
  const duration = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(duration / 60000);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${padWithZero(hours)}:${padWithZero(minutes)}`;
}

export function getDurationHours(start: Date, end: Date) {
  //arrondi à 0.25 près
  const duration = end.getTime() - start.getTime();
  const durationHours = duration / 1000 / 60 / 60;
  return Math.round(durationHours * 4) / 4;
}

export function getFormattedDurationFromMs(duration: number): String {
  const negatif = duration < 0 ? "-" : "";
  if (duration < 0) duration = -duration;
  const durationMinutes = Math.floor(duration / 60000);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${negatif}${padWithZero(hours)}:${padWithZero(minutes)}`;
}
