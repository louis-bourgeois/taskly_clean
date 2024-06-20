import { addDays, format, getDate } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";

const DateHeader = ({ index, onDateChange }) => {
  // Mémorisation des dates et labels constants
  const { futureDate, dayLabel, dateNumber } = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, index);

    const dayLabel =
      index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;
    const dateNumber = getDate(futureDate);

    return { futureDate, dayLabel, dateNumber };
  }, [index]);

  // State pour l'heure actuelle
  const [currentHour, setCurrentHour] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatage de l'heure
  const formattedHour = useMemo(() => {
    return format(currentHour, "HH:mm");
  }, [currentHour]);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(futureDate);
    }
  }, [futureDate, onDateChange]);

  const dateOptions = useMemo(() => ({ weekday: "long" }), []);

  return (
    <>
      <h2 className="text-5xl font-extralight">
        {(dateNumber < 10 ? "0" : "") + dateNumber}
      </h2>
      <h2 className="text-5xl font-bold">
        {dayLabel || format(futureDate, "EEEE", dateOptions)}
      </h2>
      <div>
        <span className="text-xl">{formattedHour}</span>
      </div>
    </>
  );
};

// Utilisation de React.memo pour éviter les re-rendus inutiles
export default React.memo(DateHeader);
