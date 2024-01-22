import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviateNumber(number?: number): string {
  if (!number) {
    return " a plethora of";
  } else if (number >= 1000000) {
    const noOfMillions = Math.floor(number / 1000000);

    if (number - noOfMillions * 1000000 >= 100000) {
      return (number / 1000000).toFixed(1) + "M+";
    }

    return (number / 1000000).toFixed(0) + "M+";
  } else if (number >= 1000) {
    const noOfThousands = Math.floor(number / 1000);

    if (number - noOfThousands * 1000 >= 100) {
      return (number / 1000).toFixed(1) + "K+";
    }

    return (number / 1000).toFixed(0) + "K+";
  }

  return number.toString();
}

export function sanitize(input: string) {
  const map: { [x: string]: string } = {
    // "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    // '"': "&quot;",
    // "'": "&#x27;",
    // "/": "&#x2F;",
    // "`": "&grave;",
  };

  // const reg = /[&<>"'/`]/gi;
  const reg = /[<>]/gi;
  return input.replace(reg, (match) => map[match]);
}

export function convertToPrettyDateFormat(input: Date) {
  let inputDate = new Date(input);

  const date = inputDate.getDate();
  const month = inputDate.getMonth() + 1;
  const year = inputDate.getFullYear();

  // const hours =
  //   inputDate.getHours() > 12
  //     ? inputDate.getHours() - 12
  //     : inputDate.getHours() === 0
  //     ? 12
  //     : inputDate.getHours();

  // const minutes =
  //   inputDate.getMinutes() < 10
  //     ? "0" + inputDate.getMinutes()
  //     : inputDate.getMinutes();
  // const amOrPm = inputDate.getHours() >= 12 ? "PM" : "AM";

  let fullDate = `${date}/${month}/${year}`;

  // let today = new Date();

  // if (
  //   inputDate.toLocaleDateString() ===
  //   new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   ).toLocaleDateString()
  // ) {
  //   fullDate = "TODAY";
  // }

  // return `${fullDate} AT ${hours}:${minutes} ${amOrPm}`;
  return `${fullDate}`;
}
