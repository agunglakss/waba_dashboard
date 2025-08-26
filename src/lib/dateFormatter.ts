export const yesterdayUTC7 = () => {
  const now = new Date();

  // shift to UTC
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // adjust to UTC+7
  const utc7 = new Date(utc + 7 * 60 * 60000);

  // move to yesterday
  utc7.setDate(utc7.getDate() - 1);

  // format as yyyy-mm-dd
  const year = utc7.getFullYear();
  const month = String(utc7.getMonth() + 1).padStart(2, "0");
  const day = String(utc7.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// formarter unix timestamp for start date, 20-08-2025T00:00:00+7 -> 1755622800
export const toTimeStampStartDate = (date: string) => {
  console.log(date)
  const startDateTime = new Date(date + "T00:00:00+07:00");
  return Math.floor(startDateTime.getTime() / 1000);
}

// formatter unix timestamp for end date, 20-08-2025T23:59:59+7 -> 1755709199
export const toTimeStampEndDate = (date: string) => {
  const endDateTime = new Date(date + "T23:59:59+07:00");
  return Math.floor(endDateTime.getTime() / 1000);
}

