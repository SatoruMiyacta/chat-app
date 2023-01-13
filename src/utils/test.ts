export const test = (date: Date) => {
  // const date = new Date()
  const year = String(date.getFullYear());
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}/${month}/${day}`;
};
