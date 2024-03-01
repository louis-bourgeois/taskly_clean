"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifie si les données utilisateur existent dans les cookies au chargement de l'application
    const userData = Cookies.get("user")
      ? JSON.parse(Cookies.get("user"))
      : null;
    if (userData) {
      setUser(userData);
    }
  }, []);

  const login = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("userData ", response.data.user);
      if (response.status === 200) {
        console.log("result", response);
        const userData = response.data.user;
        setUser(userData); // Met à jour l'état avec les données de l'utilisateur
        return response; // Retourne l'objet de réponse complet
      }
    } catch (error) {
      console.log("Error: ", error.response ? error.response : error.message);
      return error.response
        ? error.response
        : { status: 500, data: { message: error.message } };
    }
  };

  const logout = () => {
    // Implement logout functionality here
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
