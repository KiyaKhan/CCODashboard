import { cn } from '@/Libs/Utils'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button';
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker"
import { RxCalendar } from 'react-icons/rx';
import { Calendar } from './ui/calendar';

interface CalendarDateRangePickerProps{
    className?:string;
    date?:DateRange,
    setDate:Dispatch<SetStateAction<DateRange | undefined>>
}

const CalendarDateRangePicker:FC<CalendarDateRangePickerProps> = ({className,date,setDate}) => {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <RxCalendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default CalendarDateRangePicker