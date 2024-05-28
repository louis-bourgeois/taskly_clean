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
    const user = req.body.user;
    const found_user = await User.findId(undefined, user.email, undefined);
    const linked_section = newTaskData.linked_section || "";
    const user_id = found_user[0][0];
    const priority = newTaskData.priority || undefined;
    const creationDate = now();
    console.log("====================================");
    console.log(user_id);
    console.log("====================================");
    const task = new Task(
      user_id,
      newTaskData.title,
      creationDate,
      newTaskData.status,

      newTaskData.dueDate,

      newTaskData.subtasks,

      priority,
      linked_section
    );

    await task.save();

    res.status(200).json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);

    res.status(500).json({ message: "Error adding task" });
  }
}
