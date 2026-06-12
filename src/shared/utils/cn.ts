import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges class names with clsx and resolves Tailwind conflicts via twMerge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}