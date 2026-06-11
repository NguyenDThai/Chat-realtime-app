export const formatDataSeparator = (dataStr: string) => {
  const date = new Date(dataStr);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const compareDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (compareDate.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
