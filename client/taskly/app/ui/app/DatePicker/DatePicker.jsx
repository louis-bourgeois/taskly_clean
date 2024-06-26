"use client";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import TaskMenuSectionContainer from "../TaskMenu/TaskMenuSectionContainer";

const daysOfWeekSundayStart = ["S", "M", "T", "W", "T", "F", "S"];
const daysOfWeekMondayStart = ["M", "T", "W", "T", "F", "S", "S"];

const DatePicker = ({
  startOfWeekOnSunday = true,
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [adjustedDaysOfWeek, setAdjustedDaysOfWeek] = useState(
    startOfWeekOnSunday ? daysOfWeekSundayStart : daysOfWeekMondayStart
  );

  useEffect(() => {
    generateDays(currentDate);
    setAdjustedDaysOfWeek(
      startOfWeekOnSunday ? daysOfWeekSundayStart : daysOfWeekMondayStart
    );
  }, [currentDate, startOfWeekOnSunday]);

  const generateDays = (date) => {
    const weekStartsOn = startOfWeekOnSunday ? 0 : 1;
    const start = startOfWeek(startOfMonth(date), { weekStartsOn });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn });
    const daysArray = [];
    let day = start;
    while (day <= end) {
      daysArray.push(day);
      day = addDays(day, 1);
    }
    setDays(daysArray);
  };

  const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const isSelectedDate = (date) => {
    return selectedDate && format(date, "yyyy-MM-dd") === selectedDate;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const handlePreviousMonth = () => {
    setCurrentDate(addDays(startOfMonth(currentDate), -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  };

  const handleDateClick = (date) => {
    if (!isPastDate(date)) {
      onDateSelect(format(date, "yyyy-MM-dd"));
    }
  };

  const handleFastDateClick = (name) => {
    let date;
    switch (name) {
      case "Today":
        date = new Date();
        break;
      case "Tomorrow":
        date = addDays(new Date(), 1);
        break;
      case "Next Week":
        date = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });
        break;
      case "This Weekend":
        const dayOfWeek = new Date().getDay();
        date = addDays(new Date(), 6 - dayOfWeek);
        break;
      default:
        return; // Do nothing if the name is not recognized
    }
    onDateSelect(format(date, "yyyy-MM-dd"));
  };

  return (
    <>
      <div className="w-full p-4">
        <Slider {...settings}>
          {[
            { name: "Today" },
            { name: "Tomorrow" },
            { name: "This Weekend" },
            { name: "Next Week" },
          ].map((fastDate, index) => (
            <div key={index} className="px-2">
              <div
                onClick={() => handleFastDateClick(fastDate.name)}
                className="cursor-pointer hover:scale-105 transition-transform transition transition-all flex h-[50%] items-center justify-center bg-white rounded-[20px] my-2 p-2"
                style={{
                  boxShadow: "0px 4px 4px 0px rgba(0, 122, 255, 0.25)",
                }}
              >
                <p className="text-xs font-bold">{fastDate.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <TaskMenuSectionContainer othersStyles="w-full h-[75%] p-4 flex flex-col">
        <div className="w-full p-4 pt-0 flex items-center justify-between ">
          <button
            className="select-none text-4xl"
            onClick={handlePreviousMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button
            className="select-none text-4xl 4xl:text-6xl"
            onClick={handleNextMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#007AFF"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {adjustedDaysOfWeek.map((day, index) => (
            <div
              key={index}
              className="text-center text-xs 4xl:text-base font-bold"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`text-center text-xs  4xl:text-base transition transition-transform transition-color duration-500 cursor-pointer ${
                isSameMonth(day, currentDate)
                  ? isPastDate(day)
                    ? "text-gray-400 cursor-default"
                    : isSelectedDate(day)
                    ? "text-blue"
                    : "text-black hover:text-blue hover:scale-110 active:scale-95"
                  : "text-gray-300 cursor-default opacity-0"
              }`}
              onClick={() =>
                isSameMonth(day, currentDate) && handleDateClick(day)
              }
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
      </TaskMenuSectionContainer>
    </>
  );
};

export default DatePicker;
