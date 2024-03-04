"use client";
import { register } from "swiper/element/bundle";
import { useUser } from "../../../context/UserContext";

export default function Page() {
  register();
  const { user, logout } = useUser();

  return (
    // <>
    //   <swiper-container
    //     class="h-[70vh] mt-[5vh] shadow-2xl"
    //     slides-per-view="1"
    //     mousewheel-force-to-axis="true"
    //   >
    //     <swiper-slide class="m-5vh border border-blue ">Slide 2</swiper-slide>
    //     <swiper-slide>Slide 3</swiper-slide>
    //     <swiper-slide>Slide 4</swiper-slide>
    //   </swiper-container>
    // </>
  );
}
