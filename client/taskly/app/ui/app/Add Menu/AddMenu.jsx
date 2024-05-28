"use client";
import { useContext, useState } from "react";
import { MenuContext } from "../../../../context/MenuContext";
import { useUser } from "../../../../context/UserContext";
import Blur from "../Blur";
import Div from "../Div";

export default function AddMenu({ visibility }) {
  const { isAddMenuOpen, toggleAddMenu } = useContext(MenuContext);
  const { user, addTask } = useUser();
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [difficulty, setDifficulty] = useState(undefined);
  const [subTasks, setSubTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("todo");
  const [newTag, setNewTag] = useState("");
  const [taskArrowIsClicked, setTaskArrowIsClicked] = useState(false);
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
  const createTask = () => {
    const data = {
      title: titleValue,
      description: descriptionValue,
      subTasks: subTasks,
      difficulty: difficulty,
      status: status,
    };
    console.log(data);
    addTask(user, data);
  };

  return (
    <>
      <Blur
        trigger={toggleAddMenu}
        show={isAddMenuOpen}
        showZ="40"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      ></Blur>
      <Div
        styles={`flex  border border-[rgba(0,0,0,0.15)] gap-[0.5%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-[80] fontMenu transition-all duration-300 rounded-[3.125vw] ${
          visibility ? "w-[63vw] h-[64vh] opacity-100" : "w-0 h-0 opacity-0"
        } `}
        notBorder
      >
        <div className="flex flex-col w-[30%]   rounded-l-[3.125vw]  justify-left">
          <div className="h-[25%] flex justify-center items-center">
            <input
              type="text"
              placeholder="Title"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className={`bg-transparent text-center w-full p-8 focus:outline-none text-blue font-bold placeholder-blue ${getTextSizeClass(
                titleValue
              )}`}
            />
          </div>
          <div className="flex flex-col h-[75%]  rounded-bl-[3.125vw] px-[5%] pb-[2.2%] rounded-[20px] justify-left gap-[8.6%]">
            <div className="flex items-center justify-between addMenuElement h-[12%] rounded-[110px]">
              <h2 className="pl-[4%] font-bold text-4xl">Task</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                className={`cursor-pointer ${
                  taskArrowIsClicked ? "arrow-rotated" : ""
                } transition-transform duration-500 `}
                viewBox="0 0 29 29"
                width="62.5"
                height="62.5"
                onClick={(e) => setTaskArrowIsClicked(!taskArrowIsClicked)}
              >
                <path
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-miterlimit="10"
                  stroke-width="2.5"
                  d="m20.5 11.5-6 6-6-6"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col justify-between addMenuElement h-[77.5%] rounded-[20px] rounded-bl-[3.125vw]">
              <h2 className=" p-[3%]  font-bold text-4xl">Tag(s)</h2>
              <div className="ml-auto h-[60%] w-[70%]"></div>
              <button className="active:scale-95 transition transition-all font-bold flex justify-center items-center h-[15%] addMenuElement rounded-[20px] rounded-bl-[3.125vw] m-[3%]">
                <h4>New Tag</h4>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[70%] rounded-br-[3.125vw]">
          <div className="h-[57%] addMenuElement font-bold text-4xl rounded-[20px] rounded-tr-[3.125vw]">
            <h2 className="p-[2%]">Subtask(s)</h2>
          </div>
          <div className="flex justify-left h-[40%] pt-[2%] ">
            <div
              className="w-[55%] font-bold text-4xl rounded-[20px] addMenuElement
"
            >
              <h2 className="pb-0 p-[2%]">Description</h2>
              <textarea
                style={{ resize: "none", outline: "none" }}
                name="description"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                className="h-[80%] p-[2.5%] w-full  text-base pt-[4%] "
                placeholder="Enter a description"
              ></textarea>
            </div>
            <div className="flex flex-col justify-between w-[45%] pr-[2.5%] ml-[2%] ">
              <div className=" w-full h-[70%] addMenuElement rounded-[20px]">
                <h2 className="font-bold text-4xl p-[2%]">Difficulty</h2>
              </div>
              <button
                onClick={() => {
                  createTask();
                  toggleAddMenu(!isAddMenuOpen);
                }}
                className="transition transition-all active:scale-95 flex items-center justify-left w-full h-[25%] font-bold text-4xl addMenuElement rounded-[20px] rounded-br-[3.125vw]"
              >
                <span className="p-[2%]">Create</span>
              </button>
            </div>
          </div>
        </div>
      </Div>
    </>
  );
}
