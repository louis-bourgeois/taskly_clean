import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavButton from "ui/app/NavButton";
import { useUser } from "../../../context/UserContext";
import Div from "./Div";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useUser(); // Moved useUser hook to the top level
  const [title, setTitle] = useState("Welcome");
  const [name, setName] = useState("guest");
  const [showMenu, setShowMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);
  const containerRef = useRef(null);
  const updateTitle = () => {
    setName(user.first_name);
  };

  const handlePPclick = () => {
    setShowMenu(!showMenu);
  };
  const updateDimensionsRef = useRef(() => {
    // Cette fonction initiale est un placeholder;
    // elle sera remplacée dans useEffect.
  });
  useEffect(() => {
    updateDimensionsRef.current = () => {
      if (showMenu && elementRef.current) {
        const scale = showMenu ? 0.8 : 1;
        const rect = elementRef.current.getBoundingClientRect();

        const adjustedHeight = rect.height * scale;
        const adjustedTop = rect.top + (rect.height - adjustedHeight) / 2;
        setHeight(adjustedHeight);
        setMarginTop(adjustedTop);
      }
    };

    updateDimensionsRef.current();
    window.addEventListener("resize", updateDimensionsRef.current);

    return () => {
      window.removeEventListener("resize", updateDimensionsRef.current);
    };
  }, [showMenu, elementRef]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
  }, [user, loading, router]);
  useEffect(() => {
    if (user) {
      updateTitle();
    }
  }, [user]);

  useEffect(() => {
    const titles = {
      evening: "Good Evening,",
      night: "Good Night,",
      morning: "Good Morning,",
      afternoon: "Good Afternoon,",
      meal: "Bon Appétit,",
    };

    const currentHour = new Date().getHours();
    const getTitle = () => {
      if (currentHour >= 23 || currentHour < 6) return titles.night;
      if (currentHour >= 6 && currentHour < 12) return titles.morning;
      if (currentHour === 12) return titles.meal;
      if (currentHour > 12 && currentHour < 18) return titles.afternoon;
      return titles.evening;
    };

    setTitle(getTitle());
  }, []);
  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => {
        setShowContentMenu(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowContentMenu(false);
    }
  }, [showMenu]);
  if (loading) {
    return null;
  }

  return (
    <>
      <Div
        styles={`absolute bg-white z-20 fontMenu top-0 left-0 flex flex-col justify-between rounded-[3.125vw] rounded-tl-[0] transition-all ease-in-out duration-500 ${
          showMenu ? "w-[17vw] h-[60vh] opacity-100" : "w-0 h-0 opacity-0"
        }`}
        absolute
        notBorder
      >
        <div
          ref={containerRef}
          className={`flex items-center justify-end gap-[1.325vw] transition-opacity duration-300 ease-in ${
            showContentMenu ? "opacity-100" : "opacity-0"
          } `}
          style={{
            marginTop: `${marginTop}px`,
            height: `${height}px`,
          }}
        >
          <div className="flex flex-col items-start justify-between">
            <h3 className={`text-[2em] font-extrabold leading-none `}>
              {name}
            </h3>
            <p
              className={`delay-250 text-[0.8em] cursor-pointer font-light leading-none pl-[0.075vw]`}
            >
              Free plan
            </p>
          </div>
          <svg
            className="w-[10%] cursor-pointer mr-[1vw] transition duration-700 ease-in-out"
            viewBox="0 0 33 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.32086 18.3589L4.3578 18.6459L4.12735 18.8209L0.612505 21.4902C0.612289 21.4904 0.612076 21.4905 0.61186 21.4907C0.502794 21.5748 0.461592 21.7328 0.541822 21.8801L3.87127 27.4739L3.8714 27.4738L3.87756 27.4848C3.94976 27.6133 4.11534 27.6803 4.27899 27.619C4.27955 27.6188 4.28011 27.6186 4.28067 27.6183L8.4266 26.0013L8.6815 25.9019L8.90266 26.063C9.74336 26.6753 10.6402 27.2029 11.6098 27.5888L11.8775 27.6953L11.9196 27.9803L12.5529 32.2696L12.553 32.2696L12.5542 32.2788C12.5691 32.3943 12.6852 32.5224 12.8749 32.5224H19.5416C19.7313 32.5224 19.8475 32.3943 19.8624 32.2788L19.8623 32.2788L19.8636 32.2696L20.497 27.9803L20.5391 27.6953L20.8067 27.5888C21.7799 27.2015 22.6751 26.6896 23.509 26.0666L23.7314 25.9005L23.99 26.0013L28.1309 27.6164C28.3001 27.6729 28.4755 27.5979 28.539 27.4848L28.5389 27.4847L28.5453 27.4739L31.8747 21.8801C31.955 21.7328 31.9138 21.5748 31.8047 21.4907C31.8045 21.4905 31.8043 21.4904 31.8041 21.4902L28.2892 18.8209L28.0588 18.6459L28.0957 18.3589C28.161 17.8515 28.2083 17.3408 28.2083 16.8365C28.2083 16.3323 28.161 15.8216 28.0957 15.3141L28.0588 15.0271L28.2892 14.8521L31.8041 12.1828C31.8043 12.1827 31.8045 12.1825 31.8047 12.1823C31.9295 12.0862 31.9576 11.9293 31.8811 11.8036L31.8786 11.7995L28.5453 6.19915L28.5452 6.19923L28.539 6.18827C28.4668 6.0597 28.3012 5.99276 28.1375 6.05412L23.99 7.67175L23.7351 7.77116L23.5139 7.61008C22.6732 6.99774 21.7764 6.47021 20.8067 6.08426L20.5391 5.97773L20.497 5.69274L19.8636 1.40348L19.8636 1.40349L19.8624 1.39427C19.8475 1.27879 19.7313 1.15063 19.5416 1.15063H12.8749C12.6852 1.15063 12.5691 1.27879 12.5542 1.39427L12.5543 1.39428L12.5529 1.40348L11.9196 5.69274L11.8775 5.97773L11.6098 6.08426C10.6366 6.47161 9.74146 6.9835 8.90752 7.60649L8.68517 7.7726L8.4266 7.67175L4.28572 6.05672C4.11643 6.00014 3.94109 6.07517 3.87756 6.18827L3.8777 6.18835L3.87127 6.19915L0.541807 11.793C0.461617 11.9403 0.502779 12.0982 0.611782 12.1823C0.612022 12.1825 0.612263 12.1827 0.612505 12.1828L4.12735 14.8521L4.3578 15.0271L4.32086 15.3141C4.25548 15.8221 4.20828 16.3164 4.20828 16.8365C4.20828 17.3566 4.25548 17.851 4.32086 18.3589ZM22.5416 16.8365C22.5416 20.2502 19.6872 23.0016 16.2083 23.0016C12.7294 23.0016 9.87495 20.2502 9.87495 16.8365C9.87495 13.4228 12.7294 10.6715 16.2083 10.6715C19.6872 10.6715 22.5416 13.4228 22.5416 16.8365Z"
              stroke="black"
            />
          </svg>
        </div>
      </Div>
      <ul
        className={`flex items-center justify-between`}
        style={{
          marginTop: "clamp(1vh, 2vh, 3vh)",
          fontSize: "clamp(0.25rem, 1vw + 0.1rem, 4rem)",
        }}
      >
        <li
          className={`grow-0 max-w-[7.0%] z-20 h-full`}
          style={{ padding: "0 clamp(1rem, 0.675cqi, 9rem" }}
        >
          <div
            className="cursor-pointer flex items-start justify-center"
            onClick={handlePPclick}
          >
            <Image
              ref={elementRef}
              src="/user/photo_profil_google.jpeg"
              alt="Profile Picture"
              width={150}
              height={150}
              priority={true}
              quality={100}
              className={`rounded-full transition-all duration-300 max-w-full ease ${
                showMenu ? "scale-[0.8]" : ""
              }`}
              onLoad={() => updateDimensionsRef.current()}
            />
          </div>
        </li>
        <li>
          <h1 className=" text-[4em] font-black">
            {title} <span className="text-blue">{name}</span>
          </h1>
        </li>
        <li className="flex max-w-[17.5%] gap-iconsContainer items-center justify-center h-full mr-[0.5vw]">
          <NavButton styles="border border-blue rounded-full shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="grow-0 shrink-0 w-full p-[20%]"
              aria-label="Search"
            >
              <path d="M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038Z"></path>
            </svg>
          </NavButton>
          <NavButton flexShrinkGrow styles="w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="flex justify-center items-center text-blue"
              aria-label="Add"
              fill="currentColor"
            >
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8 A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path>
            </svg>
          </NavButton>
        </li>
      </ul>
    </>
  );
}
