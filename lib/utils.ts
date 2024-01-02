import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviateNumber(number: number): string {
  if(number >= 1000000){
    return (number / 1000000).toFixed(1) + 'M+'; 
  }
  else if(number >= 1000){
    return (number / 1000).toFixed(1) + 'K+';
  }
  return number.toString();
}