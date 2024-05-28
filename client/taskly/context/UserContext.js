"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("====================================");
    console.log("useEffect useUser");
    console.log("====================================");
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/me`, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          setUser({ ...response.data.user });
          console.log("u", response);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    console.log("====================================");
    console.log("login userContext");
    console.log("====================================");
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("ress", response.data.user);

        setUser({ ...response.data.user[1], ...response.data.user[3] });
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("====================================");
    console.log("log out userContext");
    console.log("====================================");
    setUser(null);
  };

  const modifyTask = async (task, user, action) => {
    console.log("ok", task);
    try {
      switch (action) {
        case "post":
          await axios.post(
            `${baseUrl}/tasks/update`,
            {
              // la requête doit retourner les nouvelles data de la task, puis je remplace le user, avec la task upgrade dans cette fonction.
              task: task,
              action: action,
            },
            { withCredentials: true }
          );
          break;

        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  const addTask = async (user, taskData) => {
    console.log("task add", taskData);
    try {
      await axios.post(`${baseUrl}/tasks/add`, {
        taskData: taskData,
        user: user,
      });
    } catch (error) {
      throw error;
    }
  };
  return (
    <UserContext.Provider
      value={{ user, login, loading, logout, modifyTask, addTask }}
    >
      {children}
    </UserContext.Provider>
  );
};
