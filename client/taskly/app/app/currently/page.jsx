"use client";
import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";

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

  let slideNumber = 14;

  return (
    <>
      <SlickCarousel settings={settings} slideNb={slideNumber}>
        {[...Array(slideNumber).keys()].map((index) => (
          <Slide index={index} key={index}>
            <SlideNav>
              <DateHeader index={index}></DateHeader>
            </SlideNav>
            <SectionContainer></SectionContainer>
          </Slide>
        ))}
      </SlickCarousel>
    </>
  );
}
