import { type ClassValue, clsx } from "clsx"
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseDateRange = (d:DateRange | undefined):{from:string | null; to: string | null} => {
  const from = setTimeZone(new Date(d?.from + '')); //new Date(d?.from + '').toLocaleDateString();
  const to = d?.to ? setTimeZone(new Date(d?.to + '')) : null; //new Date(d?.to + '').toLocaleDateString() : null;
  const formatDate = (dateStr: string | null) => {
      if(!dateStr){return null}
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }; 
  return {from:formatDate(from), to: formatDate(to)};
}
export const setTimeZone = (date : Date) => {
  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila', // Set your desired timezone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}