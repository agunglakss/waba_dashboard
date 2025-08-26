const now = new Date();

// yesterday (00:00:00)
const startDateTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1,
  0, 0, 0
);
export const startTimeStamp = Math.floor(startDateTime.getTime() / 1000);

// yesterday (23:59:59)
const endDateTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  0, 0, -1
);
export const endTimeStamp = Math.floor(endDateTime.getTime() / 1000);

// formarter unix timestamp for start date, 20-08-2025T00:00:00+7 -> 1755622800
export const toTimeStampStartDate = (date: string) => {
  const startDateTime = new Date(date + "T00:00:00+07:00");
  return Math.floor(startDateTime.getTime() / 1000);
}

// formatter unix timestamp for end date, 20-08-2025T23:59:59+7 -> 1755709199
export const toTimeStampEndDate = (date: string) => {
  const endDateTime = new Date(date + "T23:59:59+07:00");
  return Math.floor(endDateTime.getTime() / 1000);
}

