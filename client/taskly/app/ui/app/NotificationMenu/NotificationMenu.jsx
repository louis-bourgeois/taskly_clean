import { useRef } from "react";
import Div from "../Div";

export default function NotificationMenu({ data }) {
  const notificationRef = useRef(null);

  return (
    <Div
      ref={notificationRef}
      notBorder
      styles={`rounded-[13px] ${
        data?.error ? "bg-[#FF8B8B]" : "bg-[#DBECFF]"
      } max-w-[25vw] max-h-[20vh] flex flex-col gap-[20px] p-5 z-[150] transition duration-150 ease-out transition-all`}
      data-id={data.id}
    >
      <div className="flex justify-between items-center gap-4 transition duration-150 ease-out transition-all">
        <h1 className="text-2xl font-bold transition duration-150 ease-out transition-all">
          {data?.title}
        </h1>
        <div className="w-[25px] h-[25px] rounded-full border border-blue cursor-pointer transition duration-150 ease-out transition-all"></div>
      </div>
      <div className="flex justify-between transition duration-150 ease-out transition-all">
        <p className="transition duration-150 ease-out transition-all">
          {data?.subtitle}
        </p>
        <div className="flex justify-betweentransition duration-150 ease-out transition-all">
          <p className="transition duration-150 ease-out transition-all">
            {data?.tagName}
          </p>
          <div
            className={`w-[15px] h-[15px] rounded-full border border-blue bg-[${data?.tagColor}] transition duration-150 ease-out transition-all`}
          ></div>
        </div>
      </div>
    </Div>
  );
}
