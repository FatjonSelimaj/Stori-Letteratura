import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/VintageWidget.css";

type CalendarDate = {
    month: number;
    year: number;
};

type Holiday = {
    date: string; // Formato "YYYY-MM-DD"
    name: string;
};

const VintageWidget: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [historicalEvent, setHistoricalEvent] = useState<string>("Caricamento evento...");
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState<CalendarDate>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const today = new Date();

    const calculateEaster = (year: number): Date => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31); // Calcolo del mese
        const day = ((h + l - 7 * m + 114) % 31) + 1;         // Calcolo del giorno

        return new Date(year, month - 1, day); // Il mese in Date è 0-based
    };

    const calculateEasterMonday = (easter: Date): Date => {
        const easterMonday = new Date(easter);
        easterMonday.setDate(easter.getDate() + 1); // Giorno successivo
        return easterMonday;
    };

    const getItalianHolidays = (year: number): Holiday[] => {
        const easter = calculateEaster(year);
        const easterMonday = calculateEasterMonday(easter);

        const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        return [
            { date: `${year}-01-01`, name: "Capodanno" },
            { date: `${year}-01-06`, name: "Epifania" },
            { date: `${year}-04-25`, name: "Festa della Liberazione" },
            { date: `${year}-05-01`, name: "Festa dei Lavoratori" },
            { date: `${year}-06-02`, name: "Festa della Repubblica" },
            { date: `${year}-08-15`, name: "Ferragosto" },
            { date: `${year}-11-01`, name: "Ognissanti" },
            { date: `${year}-12-08`, name: "Immacolata Concezione" },
            { date: `${year}-12-25`, name: "Natale" },
            { date: `${year}-12-26`, name: "Santo Stefano" },
            { date: `${year}-12-31`, name: "San Silvestro" },
            { date: formatDate(easter), name: "Pasqua" },
            { date: formatDate(easterMonday), name: "Lunedì dell'Angelo (Pasquetta)" },
        ];
    };


    const calculateMonthStartOffset = (month: number, year: number): number => {
        const lastDayOfPreviousMonth = new Date(year, month, 0).getDay();
        return (lastDayOfPreviousMonth + 1) % 7;
    };

    const generateDays = (month: number, year: number) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const offset = calculateMonthStartOffset(month, year);

        return Array.from({ length: offset + daysInMonth }, (_, i) =>
            i < offset ? null : i - offset + 1
        );
    };

    const isHoliday = (day: number, month: number): Holiday | null => {
        const dateStr = `${currentDate.year}-${(month + 1).toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`;
        return getItalianHolidays(currentDate.year).find((holiday) => holiday.date === dateStr) || null;
    };

    const handleMonthChange = (direction: "prev" | "next") => {
        setCurrentDate((prevDate) => {
            let newMonth = prevDate.month + (direction === "next" ? 1 : -1);
            let newYear = prevDate.year;

            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }

            return { month: newMonth, year: newYear };
        });
    };

    const fetchHistoricalEvent = async () => {
        try {
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
    
            const response = await axios.get(
                `https://it.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
            );
    
            if (response.data && response.data.events && response.data.events.length > 0) {
                // Prova a trovare un evento scientifico
                const scientificEvent = response.data.events.find((event: any) =>
                    event.text.toLowerCase().includes("science") ||
                    event.text.toLowerCase().includes("discovery") ||
                    event.text.toLowerCase().includes("scientist") ||
                    event.text.toLowerCase().includes("invention")
                );
    
                if (scientificEvent) {
                    setHistoricalEvent(scientificEvent.text); // Mostra l'evento scientifico
                } else {
                    // Se non c'è un evento scientifico, prendi il primo evento disponibile
                    const fallbackEvent = response.data.events[0];
                    setHistoricalEvent(fallbackEvent.text || "Evento storico non disponibile.");
                }
            } else {
                setHistoricalEvent("Nessun evento storico trovato per oggi.");
            }
        } catch (error) {
            console.error("Errore durante il caricamento dell'evento storico:", error);
            setHistoricalEvent("Errore nel recupero dell'evento.");
        } finally {
            setLoading(false);
        }
    };    
    
    useEffect(() => {
        fetchHistoricalEvent();
    }, []);
    
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="vintage-widget">
            <div className="time-display">{currentTime}</div>
            <div className="date-display">{today.toLocaleDateString()}</div>
            <div className="event-display">
                {loading ? "Caricamento evento storico..." : historicalEvent}
            </div>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button onClick={() => handleMonthChange("prev")}>◀</button>
                    <div>
                        {new Date(currentDate.year, currentDate.month).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                    <button onClick={() => handleMonthChange("next")}>▶</button>
                </div>
                <div className="calendar-days">
                    {["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"].map((day) => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}
                    {generateDays(currentDate.month, currentDate.year).map((day, index) => {
                        const isToday =
                            day === today.getDate() &&
                            currentDate.month === today.getMonth() &&
                            currentDate.year === today.getFullYear();
                        const holiday = day !== null ? isHoliday(day, currentDate.month) : null;

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${day ? (isToday ? "today" : holiday ? "holiday" : "") : "empty"}`}
                                title={holiday ? holiday.name : ""}
                            >
                                <span>{day || ""}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VintageWidget;
