import { FC, useRef, useState } from "react";
import { Button } from "./ui/button";
import { format, isBefore, setDate, startOfToday } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { DateRange } from "react-day-picker";
import { cn } from "@/Libs/Utils";
import { RiCalendarTodoFill } from "react-icons/ri";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
interface DateProps {
    date: (DateRange | undefined);
    onSelect: (date: DateRange | undefined) => void;
    disabled?: boolean;
    withTime?: boolean;
    className?: string;
    enablePrevDate?: boolean;
    placeholder?: string;
}
const DateRangePicker: FC<DateProps> = ({ placeholder, className, date, onSelect, disabled = false, withTime = false, enablePrevDate = false }) => {
    // const [date,setDate] = useState<Date>(initial_date);
    const philippinesOffset = 8 * 60 * 60000;
    const dateTime = (): string => {
        const localDate = new Date();
        const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
        const hours = String(new Date(utcDate.getTime() + philippinesOffset).getHours()).padStart(2, '0');
        const minutes = String(new Date(utcDate.getTime() + philippinesOffset).getMinutes()).padStart(2, '0');
        return `${hours}${minutes}`;
    }

    const [time, setTime] = useState<string>(dateTime);

    const formatTime = (time: string) => {
        setTime(time);
        const timeString = time.toString().padEnd(4, '0'); // Ensure the time has at least 6 digits
        const hours = parseInt(timeString.slice(0, 2), 10);
        const minutes = parseInt(timeString.slice(2, 4), 10);
        const targetDateFrom = (date?.from instanceof Date ? date.from : new Date(date?.from || Date.now()));
        const targetDateTo = (date?.to instanceof Date ? date.to : new Date(date?.to || Date.now()));
        targetDateFrom.setHours(hours, minutes); // Set the time
        targetDateTo.setHours(hours, minutes); // Set the time
        onSelect({ from: targetDateFrom, to: targetDateTo });
    };

    const onSelectDate = (date: DateRange | undefined) => {
        onSelect(date);
        setTime(dateTime);
        const timeString = time.toString().padEnd(4, '0');
        const hours = parseInt(timeString.slice(0, 2), 10);
        const minutes = parseInt(timeString.slice(2, 4), 10);
        const targetDateFrom = ((date?.from) instanceof Date ? date.from : undefined)//new Date(date?.from || Date.now()));
        const targetDateTo = ((date?.to) instanceof Date ? date.to : undefined);

        if (targetDateFrom && targetDateTo) {
            targetDateFrom.setMinutes(minutes);
            targetDateFrom.setHours(hours, minutes);
            targetDateTo.setMinutes(minutes);
            targetDateTo.setHours(hours, minutes);
        }
        const adjustedDate = { from: targetDateFrom, to: targetDateTo }
        onSelect(adjustedDate);
    };

    const PickedDate = () => {
        let display = '';
        const state = withTime ? 'PPP p' : 'PPP';
        if (date?.from && date?.to) {
            if (date.from.getTime() === date.to.getTime()) {
                display = format(date.from, state);
            } else {
                display = `${format(date.from, state)} - ${format(date.to, state)}`;
            }
        }
        else if (!date?.to && date?.from) {
            display = date.from ? format(date.from, state) : (placeholder ?? 'Pick a date');
        }
        else {
            display = placeholder ?? 'Pick a date';
        }
        return display;
    }

    return (
        <Popover modal={false}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        `border !border-primary/70  rounded w-full pl-3 text-left font-normal ${className} `,
                        !date ? " text-muted-foreground" : " text-foreground"
                    )}>
                    {PickedDate()}
                    <RiCalendarTodoFill className="ml-2  h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 text-primary" align="start">
                {withTime && <div className="p-3 grid w-full max-w-sm items-center justify-center gap-1.5">
                    <Label>Time (24 HR Format)</Label>
                    <InputOTP maxLength={4} onChange={(val) => formatTime(val)} value={time}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        :
                        <InputOTPGroup>
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Separator />
                </div>
                }
                <Calendar
                    className="bg-background border rounded-lg"
                    disabled={(date) => !(enablePrevDate) && isBefore(date, startOfToday())}
                    mode="range"
                    onSelect={onSelectDate}
                    selected={date}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
export default DateRangePicker;