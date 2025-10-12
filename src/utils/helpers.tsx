import { endOfDay } from "date-fns";
export const normalizeToDate = (date?: Date | string) => {
  if (!date) return null;
  return endOfDay(date);
};
