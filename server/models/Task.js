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

    tags = []
  ) {
    this.owner_id = owner_id;

    this.title = title;

    this.creationDate = creationDate;

    this.status = status;

    this.priority = priority;

    this.dueDate = dueDate;

    this.subtasks = subtasks;

    this.tags = tags;

    this.linked_section = linked_section;
  }

  async save() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const linked_section = isUUID(this.linked_section)
        ? this.linked_section
        : (await Section.find(this.owner_id, "Other"))[0].id;

      const insertTask =
        "INSERT INTO task (user_id, creation_date, linked_section) VALUES ($1, $2, $3) RETURNING id";

      const result = await client.query(insertTask, [
        this.owner_id,

        this.creationDate,

        linked_section,
      ]);

      const taskId = result.rows[0].id;

      const insertTaskProp =
        "INSERT INTO task_properties (task_id, title, due_date, status, subtasks, priority, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";

      await client.query(insertTaskProp, [
        taskId,

        this.title,

        this.dueDate || null,

        this.status || null,

        JSON.stringify(this.subtasks),

        this.priority,

        this.owner_id,
      ]);

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");

      console.error("Error saving task:", e);

      switch (e.code) {
        case "23505":
          throw new Error(
            `A task with the title ${this.title} already exists. Please use a unique title!`
          );
        case "22001":
          throw new Error("The title is too long, please make sure it doesn't exceed 32 characters!")
      }
      throw e;
    } finally {
      client.release();
    }
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
        return [];
      }

      const result = await pool.query(query, queryParams);

      return result.rows;
    } catch (error) {
      console.error("Error fetching tasks:", error);

      throw error;
    }
  }

  static async delete(taskId) {
    const client = await pool.connect();
    console.log("ok");
    try {
      await client.query("BEGIN");

      // Supprimer les propriétés de la tâche
      const deleteTaskPropertiesQuery =
        "DELETE FROM task_properties WHERE task_id = $1";

      await client.query(deleteTaskPropertiesQuery, [taskId]);

      // Supprimer la tâche elle-même
      const deleteTaskQuery = "DELETE FROM task WHERE id = $1";

      await client.query(deleteTaskQuery, [taskId]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting task:", error);

      throw error;
    } finally {
      client.release();
    }
  }

  static async update(updatedTask) {
    const [currentTask] = await this.find(undefined, updatedTask.id);

    if (!currentTask) {
      console.error("Task not found (check Task.js in update)");

      throw new Error("Task not found");
    }

    const changes = compareObjects(currentTask, updatedTask);

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
        queryParams.push(updatedTask.id);

        const sqlQuery = `UPDATE ${table} SET ${setParts.join(", ")} WHERE ${
          table === "task_properties" ? "task_id" : "id"
        } = $${paramIndex}`;

        await pool.query(sqlQuery, queryParams);
      } else {
        console.log(`No changes to update in ${table}`);
      }
    }
  }
}

export default Task;
