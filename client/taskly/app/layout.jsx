import { poppins } from "@/font";
import { MenuProvider } from "../context/MenuContext";
import { TaskProvider } from "../context/TaskContext";
import { UserProvider } from "../context/UserContext";

import "./globals.css";

export const darkMode = false; // voir comment faire cela proprement mdrr
export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <TaskProvider>
        <MenuProvider>
          <html lang="en" className={poppins.className}>
            <body className={`${darkMode ? "bg-[#0D0C0C]" : ""}`}>
              {children}
            </body>
          </html>
        </MenuProvider>
      </TaskProvider>
    </UserProvider>
  );
}
