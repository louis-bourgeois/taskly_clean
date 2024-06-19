import { poppins } from "@/font";
import { MenuProvider } from "../context/MenuContext";
import { TaskProvider } from "../context/TaskContext";
import { UserProvider } from "../context/UserContext";

import { ErrorProvider } from "../context/ErrorContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import "./globals.css";

export const darkMode = false; // voir comment faire cela proprement mdrr
export default function RootLayout({ children }) {
  return (
    <NotificationsProvider>
      <ErrorProvider>
        <UserProvider>
          <TaskProvider>
            <MenuProvider>
              <html lang="en" className={poppins.className}>
                <body
                  className={`${darkMode ? "bg-[#0D0C0C]" : ""} text-shadow-01`}
                >
                  {children}
                </body>
              </html>
            </MenuProvider>
          </TaskProvider>
        </UserProvider>
      </ErrorProvider>
    </NotificationsProvider>
  );
}
