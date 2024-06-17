"use client";
import { useUser } from "@/../context/UserContext";
import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import TaskMenu from "@/ui/app/TaskMenu/TaskMenu";
import { useTask } from "../../../context/TaskContext";
export default function Page() {
  const { activeTask } = useTask();
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
  const { user, logout, loading } = useUser();
  return (
    <>
      <TaskMenu id={activeTask} visibility={!!activeTask} />

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
