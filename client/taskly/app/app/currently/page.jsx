"use client";
import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import { useState } from "react";

export default function Page() {
  const [dates, setDates] = useState([]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    centerMode: true,
    centerPadding: "150px",
    arrows: false,
    draggable: true,
  };

  let slideNumber = 14;

  const handleDateChange = (index, date) => {
    setDates((prevDates) => {
      const newDates = [...prevDates];
      newDates[index] = date;
      return newDates;
    });
  };

  return (
    <>
      <SlickCarousel settings={settings} slideNb={slideNumber}>
        {[...Array(slideNumber).keys()].map((index) => (
          <Slide index={index} key={index}>
            <SlideNav>
              <DateHeader
                index={index}
                onDateChange={(date) => handleDateChange(index, date)}
              />
            </SlideNav>
            <SectionContainer date={dates[index]} />
          </Slide>
        ))}
      </SlickCarousel>
    </>
  );
}
