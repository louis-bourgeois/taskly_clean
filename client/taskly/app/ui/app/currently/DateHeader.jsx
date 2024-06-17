import React, { useEffect, useMemo, useState } from "react";

const DateHeader = ({ index }) => {
  // Mémorisation des dates et labels constants
  const { futureDate, dayLabel, dateNumber } = useMemo(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index);

    const dayLabel =
      index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;
    const dateNumber = futureDate.getDate();

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
    return `${currentHour.getHours()}:${currentHour
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, [currentHour]);

  const dateOptions = useMemo(() => ({ weekday: "long" }), []);

  return (
    <>
      <h2 className="text-5xl font-extralight">
        {(dateNumber < 10 ? "0" : "") + dateNumber}
      </h2>
      <h2 className="text-5xl font-bold">
        {dayLabel || futureDate.toLocaleDateString("en-EN", dateOptions)}
      </h2>
      <div>
        <span className="text-xl">{formattedHour}</span>
      </div>
    </>
  );
};

// Utilisation de React.memo pour éviter les re-rendus inutiles
export default React.memo(DateHeader);
