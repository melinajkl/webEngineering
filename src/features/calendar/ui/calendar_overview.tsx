"use client";

import * as React from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { cn } from "@/server/auth/utils";
import {
  LucideCircleChevronLeft,
  LucideCircleChevronRight,
} from "lucide-react";
//import { getCalendarItems } from "@/server/db/queries/getCalendarItems";

interface CalendarEvent {
  date: string; // String Datenbank (YYYY-MM-DD)
  title: string;
  color?: string;
}

const colorBreakfast = "bg-blue-100";
const colorLunch = "bg-amber-300";
const colorDinner = "bg-rose-400";

const sampleEvents: CalendarEvent[] = [
  { date: "2025-10-01", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-01", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-01", title: "Feiertag", color: ` ${colorDinner}` },
  { date: "2025-10-01", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-01", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-02", title: "Feiertag", color: ` ${colorDinner}` },
  { date: "2025-10-02", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-02", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-02", title: "Feiertag", color: ` ${colorDinner}` },
  { date: "2025-10-03", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-04", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-09", title: "Feiertag", color: ` ${colorDinner}` },
  { date: "2025-10-09", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-09", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-09", title: "Feiertag", color: ` ${colorDinner}` },
  { date: "2025-10-21", title: "Projekt Kickoff", color: `${colorBreakfast}` },
  { date: "2025-10-21", title: "Release Meeting", color: `${colorLunch}` },
  { date: "2025-10-21", title: "Feiertag", color: ` ${colorDinner}` },
];

//const items = await getCalendarItems("2025-10-01", "2025-10-31");

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [lastMonth, setLastMonth] = React.useState(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  );
  const [nextMonth, setNextMonth] = React.useState(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
  );

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Monate Formatieren
  const monthLabel = format(currentMonth, "MMMM yyyy", { locale: enUS });
  const lastMonthLabel = format(lastMonth, "MMMM", { locale: enUS });
  const nextMonthLabel = format(nextMonth, "MMMM", { locale: enUS });

  // Monats Wechsel
  const handlePrevMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  // Berechnet den vorherigen und nächsten Monat neu,
  // wenn sich der aktuelle Monat geändert hat.
  React.useEffect(() => {
    setLastMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    setNextMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }, [currentMonth]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-sm sm:text-base">
        <button
          onClick={handlePrevMonth}
          className=" flex items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LucideCircleChevronLeft className="size-5" />
          <span className="text-sm font-medium">{lastMonthLabel}</span>
        </button>

        <h1 className="text-2xl font-semibold">{monthLabel}</h1>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-sm font-medium">{nextMonthLabel}</span>
          <LucideCircleChevronRight className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-[10px] sm:text-xs font-medium text-muted-foreground items-center text-center">
        {["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid der Tage */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 text-xs sm:text-sm">
        {days.map((day) => {
          const dayOfWeek = getDay(day) || 1; // Monday = 1
          const events = sampleEvents.filter(
            (e) => e.date === format(day, "yyyy-MM-dd")
          );

          return (
            <Card
              key={day.toISOString()}
              onClick={() => alert(`Clicked ${format(day, "dd.MM.yyyy")}`)}
              className={
                "h-20 sm:h-32 p-1 sm:p-2 text-[10px] sm:text-sm flex flex-col justify-self-auto hover:shadow-lg transition-shadow cursor-pointer"
              }
            >
              <CardHeader className="p-0 h-1">
                <CardTitle className="text-xs font-medium">
                  {format(day, "d")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-[2px] overflow-y-auto max-h-14 sm:max-h-24">
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className={cn("text-xs rounded px-1 truncate", ev.color)}
                  >
                    {ev.title}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
