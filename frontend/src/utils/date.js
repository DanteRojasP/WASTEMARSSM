// src/utils/date.js
export function addTime(date, step, unit) {
  const d = new Date(date);
  if (unit === "day") d.setDate(d.getDate() + step);
  if (unit === "month") d.setMonth(d.getMonth() + step);
  if (unit === "year") d.setFullYear(d.getFullYear() + step);
  return d;
}
