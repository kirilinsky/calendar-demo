"use client";

import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
 
export function HomeCalendarPreview() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Calendar
      mode="single"
      value={date}
      onChange={setDate}
    
      width="100%"
    >
      <CalendarNav showMonthPicker compactYears   />
      <CalendarDays />
    </Calendar>
  );
}
