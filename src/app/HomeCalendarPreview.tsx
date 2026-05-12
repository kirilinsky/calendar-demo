"use client";

import { useEffect, useState } from "react";
import { Calendar, useToday } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";

export function HomeCalendarPreview() {
  const today = useToday();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (today) setDate((current) => current ?? today);
  }, [today]);

  return (
    <Calendar value={date} onChange={setDate} width="100%">
      <CalendarNav showMonthPicker compactYears themeToggle />
      <CalendarDays />
    </Calendar>
  );
}
