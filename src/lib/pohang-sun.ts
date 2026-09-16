export type PohangSunTimes = {
  dateLabel: string;
  location: string;
  latitude: number;
  longitude: number;
  sunrise: string;
  sunset: string;
  blueHour: string;
  goldenHour: string;
  solarNoon: string;
  source: string;
};

const HOMIGOT = {
  location: '호미곶 해맞이광장',
  latitude: 36.0792,
  longitude: 129.5707,
};

const KST_OFFSET_MINUTES = 9 * 60;
const OFFICIAL_ZENITH = 90.833;

const toRadians = (degrees: number) => (Math.PI / 180) * degrees;
const toDegrees = (radians: number) => (180 / Math.PI) * radians;

const normalizeDegrees = (degrees: number) => {
  const value = degrees % 360;
  return value < 0 ? value + 360 : value;
};

const normalizeHours = (hours: number) => {
  const value = hours % 24;
  return value < 0 ? value + 24 : value;
};

const normalizeMinutes = (minutes: number) => {
  const value = minutes % 1440;
  return value < 0 ? value + 1440 : value;
};

const formatMinutes = (minutes: number) => {
  const normalized = normalizeMinutes(minutes);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getKstDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  };
};

const getDateLabel = (date: Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);

const getDayOfYear = (year: number, month: number, day: number) => {
  const current = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 0);
  return Math.floor((current - start) / 86_400_000);
};

const calculateUtcHour = (dayOfYear: number, latitude: number, longitude: number, isSunrise: boolean) => {
  const lngHour = longitude / 15;
  const approximateTime = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      1.916 * Math.sin(toRadians(meanAnomaly)) +
      0.02 * Math.sin(toRadians(2 * meanAnomaly)) +
      282.634,
  );

  let rightAscension = normalizeDegrees(toDegrees(Math.atan(0.91764 * Math.tan(toRadians(trueLongitude)))));
  const longitudeQuadrant = Math.floor(trueLongitude / 90) * 90;
  const rightAscensionQuadrant = Math.floor(rightAscension / 90) * 90;
  rightAscension = (rightAscension + longitudeQuadrant - rightAscensionQuadrant) / 15;

  const sinDec = 0.39782 * Math.sin(toRadians(trueLongitude));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosHour =
    (Math.cos(toRadians(OFFICIAL_ZENITH)) - sinDec * Math.sin(toRadians(latitude))) /
    (cosDec * Math.cos(toRadians(latitude)));

  if (cosHour > 1 || cosHour < -1) {
    return null;
  }

  const localHourAngle = isSunrise
    ? 360 - toDegrees(Math.acos(cosHour))
    : toDegrees(Math.acos(cosHour));
  const localMeanTime = localHourAngle / 15 + rightAscension - 0.06571 * approximateTime - 6.622;

  return normalizeHours(localMeanTime - lngHour);
};

const toKstMinutes = (utcHour: number) => normalizeMinutes(Math.round(utcHour * 60) + KST_OFFSET_MINUTES);

export const getPohangSunTimes = (date = new Date()): PohangSunTimes => {
  const { year, month, day } = getKstDateParts(date);
  const dayOfYear = getDayOfYear(year, month, day);
  const sunriseUtc = calculateUtcHour(dayOfYear, HOMIGOT.latitude, HOMIGOT.longitude, true);
  const sunsetUtc = calculateUtcHour(dayOfYear, HOMIGOT.latitude, HOMIGOT.longitude, false);

  const sunriseMinutes = sunriseUtc === null ? 0 : toKstMinutes(sunriseUtc);
  const sunsetMinutes = sunsetUtc === null ? 0 : toKstMinutes(sunsetUtc);
  const solarNoonMinutes = normalizeMinutes(Math.round((sunriseMinutes + sunsetMinutes) / 2));

  return {
    ...HOMIGOT,
    dateLabel: getDateLabel(date),
    sunrise: formatMinutes(sunriseMinutes),
    sunset: formatMinutes(sunsetMinutes),
    blueHour: `${formatMinutes(sunriseMinutes - 35)}-${formatMinutes(sunriseMinutes + 10)}`,
    goldenHour: `${formatMinutes(sunsetMinutes - 55)}-${formatMinutes(sunsetMinutes + 10)}`,
    solarNoon: formatMinutes(solarNoonMinutes),
    source: 'NOAA solar calculation, POING backend',
  };
};
