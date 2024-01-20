import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviateNumber(number?: number): string {
  if (!number) {
    return " a plethora of";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + " million+";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + " thousand+";
  }

  return number.toString();
}

export function sanitize(input: string) {
  const map: { [x: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&grave;",
  };

  const reg = /[&<>"'/]/gi;
  return input.replace(reg, (match) => map[match]);
}

export function convertToPrettyDateFormat(input: Date) {
  let createdDate = new Date(input);

  const date = createdDate.getDate();
  const month = createdDate.getMonth() + 1;
  const year = createdDate.getFullYear();

  const hours =
    createdDate.getHours() > 12
      ? createdDate.getHours() - 12
      : createdDate.getHours() === 0
      ? 12
      : createdDate.getHours();

  const minutes =
    createdDate.getMinutes() < 10
      ? "0" + createdDate.getMinutes()
      : createdDate.getMinutes();
  const amOrPm = createdDate.getHours() >= 12 ? "PM" : "AM";

  let fullDate = `${date}/${month}/${year}`;

  let today = new Date();

  if (
    createdDate.toLocaleDateString() ===
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toLocaleDateString()
  ) {
    fullDate = "TODAY";
  }

  return `${fullDate} AT ${hours}:${minutes} ${amOrPm}`;
}
