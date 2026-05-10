"use client";

import { useState } from "react";
import { Calendar, useToday } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";

export function HomeCalendarPreview() {
  const today = useToday();
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar value={date ?? today} onChange={setDate} width="100%">
      <CalendarNav showMonthPicker compactYears themeToggle/>
      <CalendarDays />
    </Calendar>
  );
}
