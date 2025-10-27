"use client";

import * as React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {LucideCircleChevronLeft, LucideCircleChevronRight} from "lucide-react";


interface CalendarEvent {
    date: string; // ISO string (YYYY-MM-DD)
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
];

export function CalendarPage() {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [lastMonth, setLastMonth] = React.useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const [nextMonth, setNextMonth] = React.useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Monate Formatieren
    const monthLabel = format(currentMonth, "MMMM yyyy", {locale: enUS});
    const lastMonthLabel = format(lastMonth, "MMMM", {locale: enUS});
    const nextMonthLabel = format(nextMonth, "MMMM", {locale: enUS});

    // Monats Wechsel
    const handlePrevMonth = () => {
        setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
    const handleNextMonth = () => {
        setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    };


    // Berechnet den vorherigen und nächsten Monat neu,
    // wenn sich der aktuelle Monat geändert hat.
    React.useEffect(() => {
        setLastMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setNextMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }, [currentMonth]);

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <button onClick={handlePrevMonth} className=" flex items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <LucideCircleChevronLeft className="size-5" />
                    <span className="text-sm font-medium">
                        {lastMonthLabel}
                    </span>
                </button>

                <h1 className="text-2xl font-semibold">
                    {monthLabel}
                </h1>

                <button onClick={handleNextMonth} className="flex items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <div>
                        <span className="text-sm font-medium">
                            {nextMonthLabel}
                        </span>
                        <LucideCircleChevronRight className="size-5" />
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-7 text-center font-medium text-sm text-muted-foreground">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Grid der Tage */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const dayOfWeek = getDay(day) || 1; // Monday = 1
                    const events = sampleEvents.filter(
                        (e) => e.date === format(day, "yyyy-MM-dd")
                    );

                    return (
                        <Card
                            key={day.toISOString()}
                            className={cn(
                                "h-28 p-2 text-sm flex flex-col justify-between",
                                dayOfWeek === 7 && "border-destructive/30"
                            )}
                        >
                            <CardHeader className="p-0">
                                <CardTitle className="text-xs font-medium">
                                    {format(day, "d")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-1 overflow-hidden">
                                {events.map((ev, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "text-xs text-white rounded px-1 truncate",
                                            ev.color ?? "bg-primary"
                                        )}
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
