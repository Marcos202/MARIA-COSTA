import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    targetDate: Date;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now > targetDate) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: differenceInDays(targetDate, now),
                hours: differenceInHours(targetDate, now) % 24,
                minutes: differenceInMinutes(targetDate, now) % 60,
                seconds: differenceInSeconds(targetDate, now) % 60,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-[95vw] md:max-w-[700px] mx-auto text-rosa-forte">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div
                    key={unit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-2.5 md:p-4 rounded-lg shadow-sm border border-rosa-cha/30"
                >
                    <span className="text-2xl md:text-4xl font-serif font-bold text-rosa-antigo leading-none">{value}</span>
                    <span className="text-[11px] md:text-xs uppercase tracking-tight text-gray-500 mt-1.5 md:mt-1">{unit}</span>
                </motion.div>
            ))}
        </div>
    );
};
