"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log("====================================");
        console.log(response);
        console.log("====================================");
        setUser({ ...response.data.user[1], ...response.data.user[3] });
        setTasks(response.data.user[1].tasks || []);
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
    setUser(null);
    setTasks(null);
  };

  const modifyTask = async (task, user, action) => {
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
    try {
      const response = await axios.post(`${baseUrl}/tasks/add`, {
        taskData: taskData,
        user: user,
      });

      if (response.status === 200 && response.data.tasks) {
        setTasks(() => {
          const updatedTasks = response.data.tasks;
          console.log("Updated Tasks: ", updatedTasks);
          return updatedTasks;
        });
      } else {
        console.log("response : ", response);
        console.error("Error: No task data in response", response.data);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    console.log("====================================");
    console.log("azepplelelpelo");
    console.log("====================================");
    try {
      const response = await axios.delete(`${baseUrl}/tasks/delete/${id}`);
      if (response.status === 200) {
        setTasks((preveTasks) => preveTasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error removing task " + id + " : " + error);
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
