export const calculateDateDifference = (date2: number, date1: number) => Math.round((date2.valueOf() - date1.valueOf()) / 86400000);

export const calculateDailyPrice = (date2: number, date1: number, price: number) => parseFloat(String(price / calculateDateDifference(date2, date1))).toFixed(2);
