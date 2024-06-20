"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { MenuContext } from "../../../../context/MenuContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import Blur from "../Blur";
import DatePicker from "../DatePicker/DatePicker";
import Div from "../Div";
import { Counter } from "./Counter";
import TaskMenuButton from "./TaskMenuButton";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";

export default function TaskMenu({ visibility, id = null }) {
  const { user, addTask, modifyTask, deleteTask, tasks } = useUser();
  const { isTaskMenuOpen, toggleTaskMenu } = useContext(MenuContext);
  const { setActiveTask } = useTask();

  const [task, setTask] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [status, setStatus] = useState("todo");
  const [linked_section, setLinked_section] = useState("Other");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState(undefined);
  const [subTasks, setSubTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [newTag, setNewTag] = useState("");
  const [taskArrowIsClicked, setTaskArrowIsClicked] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState(true);

  const taskTitleRef = useRef(null);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      setTitleValue("");
      setStatus("todo");
      setLinked_section("Other");
      setPriority(5);
      setDueDate(undefined);
      setSubTasks([]);
      setTags([]);
      setDescriptionValue("");
      setActiveTask(null);
      setTask(null);
    }
  }, [isTaskMenuOpen]);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find((task) => task.id === id);
      setTask(foundTask);
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [tasks, id]);

  useEffect(() => {
    if (visibility && taskTitleRef.current) {
      taskTitleRef.current.focus();
    }
  });

  useEffect(() => {
    if (task) {
      setTitleValue(task.title ?? "");
      setStatus(task.status ?? "todo");
      setLinked_section(task.linked_section ?? "Other");
      setPriority(task.priority ?? 5);
      setDueDate(task.dueDate);
      setSubTasks(task.subTasks ?? []);
      setTags(task.tags ?? []);
      setDescriptionValue(task.description ?? "");
    }
  }, [task]);

  // Handle title input change
  const handleTitleInputChange = (e) => {
    const newValue = e.target.value;
    setTitleValue(newValue);
    if (id) {
      task.title = newValue;
      setCanSubmit(true);
      try {
        const response = modifyTask(task, user, "post");
      } catch (error) {
        console.error(error);
        switch (error.response.status) {
          case 400:
            setError("Title already in use");
        }
      }
      return;
    }
    if (!task) {
      setCanSubmit(!!newValue.length);
    }
  };

  // Handle priority change
  const handlePriorityChange = (value) => {
    setPriority(value);
    if (id) {
      task.priority = value;

      modifyTask(task, user, "post");
    }
  };

  const handleDateSelect = (date) => {
    setDueDate(date);
    console.log(date);
  };
  // Determine text size class based on text length
  const getTextSizeClass = (text) => {
    const textSizeClasses = [
      { length: 4, class: "text-7xl" },
      { length: 5, class: "text-6xl" },
      { length: 6, class: "text-5xl" },
      { length: 8, class: "text-4xl" },
      { length: 10, class: "text-3xl" },
      { length: 12, class: "text-2xl" },
      { length: 13, class: "text-xl" },
    ];

    for (const { length, class: textClass } of textSizeClasses) {
      if (text.length < length) {
        return textClass;
      }
    }
    return "text-xl";
  };

  // Create a new task
  const createTask = async () => {
    try {
      const taskData = {
        title: titleValue,
        status,
        linked_section,
        priority,
        dueDate,
        subtasks: subTasks,
        tags,
        description: descriptionValue,
      };
      await addTask(user, taskData);
    } catch (error) {
      console.error(error);
    }
  };

  const delTask = () => {
    try {
      deleteTask(id);
    } catch (e) {
      console.error;
    }
  };
  return (
    <>
      <Blur
        trigger={toggleTaskMenu}
        show={isTaskMenuOpen}
        showZ="40"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      />

      <Div
        styles={`glass-morphism flex border gap-[0.5%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-[80] fontMenu transition-all duration-300 rounded-[3.125vw] py-[1.5vh] px-[1.3227%] ${
          visibility ? "w-[63vw] h-[64vh] opacity-100" : "w-0 h-0 opacity-0"
        }`}
        notBorder
      >
        <div className="flex flex-col w-[30%] rounded-l-[3.125vw] my-[1.4290277778vh] justify-left">
          <div className="h-[25%] flex justify-center items-center">
            <input
              ref={taskTitleRef}
              type="text"
              placeholder={id ? titleValue : "Title"}
              value={titleValue}
              onChange={(e) => handleTitleInputChange(e)}
              className={`bg-transparent text-center w-full p-8 focus:outline-none text-blue font-bold placeholder-blue ${getTextSizeClass(
                titleValue
              )}`}
            />
          </div>

          <div
            className={`${
              id ? "" : " flex flex-col"
            } h-[75%] rounded-bl-[3.125vw] pr-[5%] rounded-[20px] justify-end gap-[8.6%]`}
          >
            {!id && (
              <TaskMenuSectionContainer othersStyles="rounded-full justify-between items-center h-[12%]">
                <h2 className="pl-[4%] font-bold text-4xl">Task</h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  className={`cursor-pointer ${
                    taskArrowIsClicked ? "arrow-rotated" : ""
                  } transition-transform duration-500`}
                  viewBox="0 0 29 29"
                  width="62.5"
                  height="62.5"
                  onClick={(e) => setTaskArrowIsClicked(!taskArrowIsClicked)}
                >
                  <path
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="m20.5 11.5-6 6-6-6s"
                  ></path>
                </svg>
              </TaskMenuSectionContainer>
            )}
            <TaskMenuSectionContainer
              flexCol
              moreRoundedCorners="bl"
              othersStyles={`justify-between ${id ? "h-[98%]" : "h-[77.5%]"}`}
            >
              <h2 className="p-[3%] font-bold text-4xl">Tag(s)</h2>
              <div
                className={`ml-auto h-[${id ? "100%" : "60%"}] w-[70%]`}
              ></div>

              <TaskMenuButton
                flex
                moreRoundedCorners="bl"
                othersStyles="justify-center items-center font-bold m-[3%] h-[15%]"
              >
                <h4>New Tag</h4>
              </TaskMenuButton>
            </TaskMenuSectionContainer>
          </div>
        </div>

        <div className="flex flex-col w-[70%] justify-between my-[1.4290277778vh]  rounded-tr-[3.125vw]">
          <div className="flex items-center justify-between h-[57%]">
            <TaskMenuSectionContainer
              flex={false}
              othersStyles="flex flex-col justify-between items-center w-[55%] h-full"
            >
              <DatePicker
                onDateSelect={handleDateSelect}
                selectedDate={dueDate}
              />
            </TaskMenuSectionContainer>
            <TaskMenuSectionContainer
              moreRoundedCorners="tr"
              othersStyles="h-full w-[45%]  ml-[2%]"
            >
              <h2 className="p-[2%] font-bold text-4xl">Subtask(s)</h2>
            </TaskMenuSectionContainer>
          </div>
          <div className="flex justify-left h-[40%] pt-[2%] ">
            <TaskMenuSectionContainer
              flex={false}
              othersStyles="font-bold text-4xl w-[55%]"
            >
              <h2 className="pb-0 p-[2%]">Description</h2>
              <textarea
                style={{ resize: "none", outline: "none" }}
                name="description"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                className="h-[80%] p-[2.5%] w-full text-base pt-[4%]"
                placeholder="Enter a description"
              ></textarea>
            </TaskMenuSectionContainer>

            <div className="flex flex-col justify-between w-[45%] ml-[2%]">
              <TaskMenuSectionContainer
                flex={false}
                othersStyles={`w-full h-[70%]`}
              >
                <h2 className="font-bold text-4xl p-[2%]">Priority</h2>

                <div className="h-[70%] flex w-full justify-center items-center">
                  {visibility && (
                    <Counter
                      visibility={visibility}
                      onChange={(value) => handlePriorityChange(value)}
                      initialCount={priority}
                    />
                  )}
                </div>
              </TaskMenuSectionContainer>

              <TaskMenuButton
                disabled={!canSubmit}
                onClick={() => {
                  id ? delTask() : createTask();
                  toggleTaskMenu(!isTaskMenuOpen);
                }}
                moreRoundedCorners="br"
                othersStyles={`w-full h-[25%] items-center justify-left font-bold text-4xl
                `}
                flex
              >
                <span className={`${priority}`}>
                  {id ? "Delete" : "Create"}
                </span>
              </TaskMenuButton>
            </div>
          </div>
        </div>
      </Div>
    </>
  );
}
