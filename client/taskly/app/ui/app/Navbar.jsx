import Image from "next/image";
import { useRouter } from "next/navigation"; // Corrected from 'next/navigation'
import { useEffect, useState } from "react";
import NavButton from "ui/app/NavButton";
import { useUser } from "../../../context/UserContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useUser(); // Moved useUser hook to the top level
  const [title, setTitle] = useState("Welcome");
  const [name, setName] = useState("guest");
  const updateTitle = () => {
    setName(user.first_name);
  };
  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
  }, [user, loading, router]);
  useEffect(() => {
    if (user) {
      console.log("user", user);
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

  if (loading) {
    return null; // Consider a loading spinner or skeleton here
  }

  return (
    <ul className="flex items-center justify-between m-8">
      <li className="max-w-[8.75%]">
        <NavButton>
          <Image
            src="/user/photo_profil_google.jpeg"
            alt="Profile Picture"
            width={500}
            height={500}
            priority
            className="rounded-full"
          />
        </NavButton>
      </li>
      <li>
        <h1 className="sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black">
          {title} <span className="text-blue">{name}</span>
        </h1>
      </li>
      <li className="flex max-w-[17.5%] gap-iconsContainer items-center justify-center h-full mr-[0.5vw]">
        <NavButton additionalStyles="border border-blue rounded-full shadow-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="grow-0 shrink-0 w-full p-[20%]"
            aria-label="Search"
          >
            <path d="M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038Z"></path>
          </svg>
        </NavButton>
        <NavButton flexShrinkGrow additionalStyles="w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="flex justify-center items-center"
            aria-label="Add"
          >
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8 A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path>
          </svg>
        </NavButton>
      </li>
    </ul>
  );
}
