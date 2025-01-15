import {
  sub,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

export const useSelectedTimePeriod = (period) => {
  const dates = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          curr: {
            from: startOfYear(new Date()),
            to: new Date(),
          },
          prev: {
            from: startOfYear(sub(new Date(), { years: 1 })), // sub(new Date(), { years: 1 })는 현재 날짜에서 1년 뺀 날짜
            to: endOfYear(sub(new Date(), { years: 1 })),
          },
        };
      case "Monthly":
        return {
          curr: {
            from: startOfYear(new Date()),
            to: new Date(),
          },
          prev: {
            from: startOfMonth(sub(new Date(), { months: 1 })),
            to: endOfMonth(sub(new Date(), { months: 1 })),
          },
        };
      case "Daily":
        return {
          curr: {
            from: startOfYear(new Date()),
            to: new Date(),
          },
          prev: {
            from: startOfDay(sub(new Date(), { days: 1 })),
            to: endOfDay(sub(new Date(), { days: 1 })),
          },
        };
    }
  });

  return dates;
};
