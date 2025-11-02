

import * as React from "react";
import { NavigationBar } from "@/components/NavigationBar";
import {CalendarPage} from "./_components/calendarOverview";



export default function Page() {

    return(
    <div className="flex flex-col min-h-screen">
        <NavigationBar />
        <div className="flex-1 overflow-auto">
            <CalendarPage />
        </div>
    </div>
);
}
