import Task from "../models/Task.js";

export async function updateTask(req, res) {
  try {
    const { task } = req.body;
    Task.update(task);
  } catch (err) {
    console.error(err);
  }

  res.sendStatus(200);
}
