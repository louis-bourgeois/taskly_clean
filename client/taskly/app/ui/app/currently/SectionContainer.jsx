"use client";
import Task from "@/ui/app/Task/Task";
import { useEffect, useState } from "react";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";

export default function SectionContainer() {
  const { user, tasks, loading } = useUser();
  const { activeTask, setActiveTask } = useTask();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!loading && user) {
      setSections(user.sections || []);
    }
  }, [user, loading]);

  useEffect(() => {
    console.log("Tasks updated: ", tasks);
  }, [tasks]);

  useEffect(() => {
    console.log("active task: ", activeTask);
  }, [activeTask]);

  const areSameDay = (date1String, date2) => {
    const date1 = new Date(date1String);
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  };

  const expandTask = (taskId) => {
    if (taskId !== activeTask) {
      setActiveTask(taskId);
    } else {
      setActiveTask(null);
    }
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
              className="flex flex-col h-full items-start justify-start p-10 gap-8 overflow-x-scroll"
            >
              <h1 className="font-bold text-4xl">{section.name}</h1>
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => {
                  if (task && task.linked_section === section.id) {
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
