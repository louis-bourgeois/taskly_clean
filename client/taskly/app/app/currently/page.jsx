"use client";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import DateHeader from "@/ui/app/currently/DateHeader";
import SlideNav from "@/ui/app/currently/SlideNav";
import { useUser } from "../../../context/UserContext";
export default function Page() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    centerMode: true,
    centerPadding: "150px",
    arrows: false,
    draggable: true,
  };
  const { user, logout } = useUser();
  let slideNumber = 14;

  const slides = [...Array(slideNumber).keys()].map((index) => {
    return (
      <Slide index={index} key={index}>
        <SlideNav>
          <DateHeader index={index}></DateHeader>
          <div></div>
        </SlideNav>
      </Slide>
    );
  });

  return (
    <SlickCarousel settings={settings} slideNb={slideNumber}>
      {slides}
    </SlickCarousel>
  );
}
