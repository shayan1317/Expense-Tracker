import { EXPENSE_ICONS, INCOME_ICONS } from "./constants";

export const dateToString = (rawDate: Date) => {
  try {
    const date = new Date(rawDate);
    let dateString = date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return dateString;
  } catch (err) {
    console.log("err", err);
  }
};
export const getTransactionIcon = (item: any) => {
  if (item?.transactionType === "income") {
    const iconKey = item?.incomeSourceIconLabel?.toLowerCase();
    return INCOME_ICONS[iconKey]?.icon;
  } else {
    const iconKey = item.expenseIconLabel?.toLowerCase();
    return EXPENSE_ICONS[iconKey]?.icon;
  }
};

export const getTransactionColor = (item: any) => {
  if (item?.transactionType === "income") {
    const iconKey = item.incomeSourceIconLabel?.toLowerCase();
    return INCOME_ICONS[iconKey]?.color || "#10B981";
  } else {
    const iconKey = item.expenseIconLabel?.toLowerCase();
    return EXPENSE_ICONS[iconKey]?.color || "#EF4444";
  }
};

export const matchRegex = (prompt: string, type: string) => {
  let source = ["salary", "travel,transport", "grocery", "tickets"];
  let time = ["yesterday", "tommorow", "today"];

  const regex = /\d+/g;
  let res = { amount: 0, catogary: "", time: "" };
  let amount = prompt.match(regex)[0];
  res.amount = res?.amount + amount;
  let promptArray = prompt.split(" ");
  promptArray.forEach((element) => {
    if (source?.includes(element)) {
      res.catogary = element;
    } else if (time?.includes(element)) {
      res.time = element;
    }
  });
  console.log("asda", res);
};
