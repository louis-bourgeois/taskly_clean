import Navbar from "@/ui/app/Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar></Navbar>
      {children}
    </>
  );
}
