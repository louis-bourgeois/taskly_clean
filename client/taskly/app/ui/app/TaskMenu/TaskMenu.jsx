"use client";
import { useEffect } from "react";
import Div from "../Div";

export default function TaskMenu({ id }) {
  useEffect(() => console.log("ee", id));
  return (
    <Div
      styles={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 fontMenu transition-all duration-300 rounded-[3.125vw] border border-black ${
        id ? "w-[63vw] h-[64vh] opacity-100" : "w-0 h-0 opacity-0"
      } `}
    ></Div>
  );
}
