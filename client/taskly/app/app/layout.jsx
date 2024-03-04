"use client";
import Navbar from "@/ui/app/Navbar";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext.js";
export default function AppLayout({ children }) {
  const { user, loading } = useUser();
  useEffect(() => {
    if (!user && !loading) {
      redirect("/auth");
    } else {
      console.log(user);
    }
  }, [user, loading]);

  return (
    <>
      <Navbar user={user}></Navbar>

      {children}
    </>
  );
}
