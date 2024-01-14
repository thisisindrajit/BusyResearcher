import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviateNumber(number: number): string {
  if(number >= 1000000){
    return (number / 1000000).toFixed(2) + ' million+'; 
  }
  else if(number >= 1000){
    return (number / 1000).toFixed(2) + ' thousand+';
  }
  return number.toString();
}