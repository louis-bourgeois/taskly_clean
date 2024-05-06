import { useEffect, useState } from "react";

export default function DateHeader({ index }) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + index);
  const dayLabel = index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;

  const dateOptions = {
    weekday: "long",
  };
  const dateNumber = futureDate.getDate();
  const [currentHour, setCurrentHour] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });
  return (
    <>
      <h2 className="text-5xl font-extralight">
        {(dateNumber < 10 ? "0" : "") + dateNumber}
      </h2>
      <h2 className="text-5xl font-bold">
        {dayLabel || futureDate.toLocaleDateString("en-EN", dateOptions)}
      </h2>
      <div>
        <span className="text-xl">
          {currentHour.getHours() + ":" + currentHour.getMinutes()}
        </span>
      </div>
    </>
  );
}
