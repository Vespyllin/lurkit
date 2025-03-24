import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// TODO FIX
export function cn(...inputs: ClassValue[]) {
	// return twMerge(clsx(inputs));
	return clsx(inputs);
}
