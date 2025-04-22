import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type DatePickerWithRangeProps = {
  className?: string;
  onChange?: (date: DateRange | undefined) => void;
};

export function DatePickerWithRange({
  className,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleSelect = (selected: DateRange | undefined) => {
    setDate(selected);
    onChange?.(selected); // call parent handler if provided
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        id="date"
        variant={"outline"}
        className={cn(
          "w-[300px] justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <CalendarIcon />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date</span>
        )}
      </Button>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={handleSelect}
        numberOfMonths={2}
        className="rounded-2xl"
      />
    </div>
  );
}
