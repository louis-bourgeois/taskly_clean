import pool from "../config/dbConfig.js";
import { compareObjects } from "../utils/compare.js";
import { isUUID } from "../utils/validate.js";
import Section from "./Section.js";
class Task {
  constructor(
    owner_id,
    title,
    creationDate,
    status,
    linked_section,
    priority = 5,
    dueDate = undefined,
    subtasks = {},
    tags
  ) {
    this.owner_id = owner_id;
    this.title = title;
    this.creationDate = creationDate;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.subtasks = subtasks;
    this.tags = tags;
  }
  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const linked_section = isUUID(linked_section)
        ? linked_section
        : Section.find(this.owner_id, "Other")[0].id;
      const insertTask =
        "INSERT INTO task (user_id, creation_date, linked_section) VALUES ($1, $2, $3) RETURNING id";
      await client.query(insertTask, [this.owner_id, this.creationDate]);
      const taskId = rows[0].findId;

      const insertTaskProp =
        "INSERT INTO task_properties (task_id, title, due_date, status, subtasks, priority)";
      // il faut que je fasse le cas où une props = undifined et que je fasse gaffe à la date || Priority : mandatory
      await client.query(insertTaskProp, [
        taskId,
        this.title,
        this.dueDate,
        this.status,
        this.subtasks,
        this.priority,
      ]);
    } catch (e) {}
  }
  static async find(userId = undefined, taskId = undefined) {
    let query = `SELECT t.id, tp.title, tp.due_date, tp.status, tp.subtasks, tp.priority, t.linked_section 
                 FROM task t
                 INNER JOIN task_properties tp ON t.id = tp.task_id`;
    let queryParams = [];

    try {
      if (userId && taskId) {
        query += " WHERE t.user_id = $1 AND t.id = $2";
        queryParams = [userId, taskId];
      } else if (userId) {
        query += " WHERE t.user_id = $1";
        queryParams = [userId];
      } else if (taskId) {
        query += " WHERE t.id = $1";
        queryParams = [taskId];
      } else {
        // If neither userId nor taskId is provided, return an empty array or throw an error
        return [];
        // Or throw new Error("No user ID or task ID provided");
      }

      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error; // Re-throw the error to be handled by the caller, or handle it as needed
    }
  }
  static async delete() {}
  static async update(updatedTask) {
    const [currentTask] = await this.find(undefined, updatedTask.id);

    if (!currentTask) {
      console.error("Task not found (check Task.js in update)");
      throw new Error("Task not found");
    }

    const changes = compareObjects(currentTask, updatedTask);
    console.log("d", changes);
    const columnsToUpdate = Object.keys(changes);
    const linkedSectionUpdated = columnsToUpdate.includes("linked_section");
    const tablesToUpdate = linkedSectionUpdated ? ["task"] : [];

    if (columnsToUpdate.length > 1 || !linkedSectionUpdated) {
      tablesToUpdate.push("task_properties");
    }

    for (const table of tablesToUpdate) {
      let setParts = [];
      let queryParams = [];
      let paramIndex = 1;

      for (const col of columnsToUpdate) {
        if (
          (table === "task" && col === "linked_section") ||
          (table === "task_properties" && col !== "linked_section")
        ) {
          setParts.push(`${col} = $${paramIndex++}`);
          queryParams.push(changes[col]);
        }
      }

      if (queryParams.length > 0) {
        // Check if there are parameters to update
        queryParams.push(updatedTask.id);
        const sqlQuery = `UPDATE ${table} SET ${setParts.join(
          ", "
        )} WHERE task_id = $${paramIndex}`;
        console.log("SQL Query:", sqlQuery);
        console.log("Query Params:", queryParams);
        await pool.query(sqlQuery, queryParams);
      } else {
        console.log(`No changes to update in ${table}`);
      }
    }
  }
}

export default Task;
