import Task from "../models/Task.js";
import User from "../models/User.js";
import { now } from "../utils/now.js";
export async function updateTask(req, res) {
  try {
    const { task } = req.body;

    await Task.update(task);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Error updating task" });
  }
}

export async function addTask(req, res) {
  try {
    const { taskData: newTaskData } = req.body;
    console.log(newTaskData);
    const user = req.body.user;
    const found_user = await User.findId(undefined, user.email, undefined);
    const linked_section = newTaskData.linked_section || "";
    const user_id = found_user[0][0];
    const priority = newTaskData.priority || undefined;
    const creationDate = now();
    console.log("====================================");
    console.log(
      user_id,
      newTaskData.title,
      creationDate,
      newTaskData.status,
      linked_section,
      priority,
      newTaskData.dueDate,
      newTaskData.subtasks,
      newTaskData.tags
    );
    console.log("====================================");
    const task = new Task(
      user_id,
      newTaskData.title,
      creationDate,
      newTaskData.status,
      linked_section,
      priority,
      newTaskData.dueDate,
      newTaskData.subtasks,
      newTaskData.tags
    );

    await task.save();
    const user_tasks = await Task.find(user_id);
    res
      .status(200)
      .json({ message: "Task added successfully", tasks: user_tasks });
  } catch (error) {
    console.error("Error adding task:", error);

    res.status(500).json({ message: "Error adding task" });
  }
}
