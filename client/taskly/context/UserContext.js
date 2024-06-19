"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useError } from "./ErrorContext"; // Import the ErrorContext

const UserContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useError(); // Use handleError from ErrorContext

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/me`, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          setUser({ ...response.data.user });
          setTasks(response.data.user.tasks || []);
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
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser({ ...response.data.user[1], ...response.data.user[3] });
        setTasks(response.data.user[1].tasks || []);
        return response;
      }
    } catch (error) {
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTasks(null);
  };

  const modifyTask = async (task, user, action) => {
    try {
      switch (action) {
        case "post":
          await axios.post(
            `${baseUrl}/tasks/update`,
            { task, action },
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
    try {
      const response = await axios.post(
        `${baseUrl}/tasks/add`,
        { taskData, user },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        console.error("Error: No task data in response", response.data);
      }
    } catch (error) {
      console.error("error");
      handleError(error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/tasks/delete/${id}`);
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        loading,
        logout,
        tasks,
        modifyTask,
        addTask,
        deleteTask,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
