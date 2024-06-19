import Task from "../models/Task.js";
import User from "../models/User.js";
import { now } from "../utils/now.js";
import { isUUID } from "../utils/validate.js";
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

    if (error.message.includes("A task with the title")) {
      res
        .status(400)
        .json({ title: "Title already used", subtitle: error.message });
    } else if (error.message.includes("title is too long")) {
      res.status(400).json({
        title: "The new task's title is too long",
        subtitle: error.message,
      });
    } else {
      res
        .status(500)
        .json({ title: "Internal Server Error", subtitle: error.message }); // Changed from 400 to 500 and added JSON response
    }
  }
}
export async function deleteTask(req, res) {
  const uuid = req.params.id;

  const uuid_isOK = isUUID(uuid);

  if (uuid_isOK) {
    await Task.delete(uuid);
  }
  res.sendStatus(200);
}
