"use client";
import Task from "@/ui/app/Task/Task";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../../../context/MenuContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";

export default function SectionContainer({ date }) {
  const { user, tasks, loading } = useUser();
  const { activeTask, setActiveTask } = useTask();
  const [sections, setSections] = useState([]);
  const { isTaskMenuOpen, toggleTaskMenu } = useContext(MenuContext);

  useEffect(() => {
    if (!loading && user) {
      setSections(user.sections || []);
    }
  }, [user, loading]);

  const expandTask = (taskId) => {
    if (taskId !== activeTask) {
      setActiveTask(taskId);
    }
    toggleTaskMenu();
  };

  return (
    <div className="w-full h-[80%] flex">
      {Array.isArray(sections) &&
        sections.map((section, index) => {
          const hasLinkedTasks = tasks.some(
            (task) =>
              task &&
              (task.linked_section === section.name ||
                task.linked_section === section.id)
          );

          if (!hasLinkedTasks) return null;

          return (
            <div
              key={index}
              className="flex flex-col h-[96%] items-start justify-start p-10 gap-8 overflow-x-scroll scroll-hide"
            >
              <h1 className="font-bold text-4xl">{section.name}</h1>
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => {
                  if (
                    task &&
                    task.linked_section === section.id &&
                    format(task.due_date, "yyyy-MM-dd") ===
                      format(date, "yyyy-MM-dd")
                  ) {
                    return (
                      <Task
                        task={task}
                        key={task.id}
                        onTaskClick={() => expandTask(task.id)}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <p>You do not have any task due for this date</p>
              )}
            </div>
          );
        })}
    </div>
  );
}
