import { DateTime } from "luxon";

/**
 * Calculates the UTC offset for a given time zone.
 * @param {number} zone - The time zone offset in seconds.
 * @returns {string} - The UTC offset as a string.
 */
const calcOffset = (zone) => {
  let offset = `${zone > 0 ? "+" : ""}${zone / 3600}`;
  if (offset.includes(".")) {
    let remainder = Number(offset) % Number(offset.split(".")[0]);
    offset = offset.split(".")[0] + ":" + remainder * 60;
  }
  return offset;
};

/**
 * Formats a date string to a specified format in local time.
 * @param {string} secs - The number of seconds since the Unix epoch.
 * @param {number} zone - The time zone offset in seconds.
 * @param {string} format - The desired format for the date string (default is "HH:mm").
 * @returns {string} - The formatted date string.
 */
const formatToLocalTime = (secs, zone, format = "HH:mm") => {
  const offset = calcOffset(zone);
  return DateTime.fromSeconds(Number(secs))
    .setZone(`UTC${offset}`)
    .toFormat(format);
};

export { formatToLocalTime };
