"use client";
import Navbar from "@/ui/app/Navbar";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
export default function AppLayout({ children }) {
  const { user } = useUser();
  console.log(user);
  useEffect(() => {
    if (!user) {
      redirect("/auth");
    }
  });
  if (!user) {
    return null;
  }
  return (
    <>
      <Navbar></Navbar>
      {children}
    </>
  );
}
