import pool from "../config/dbConfig";
class Task {
  constructor(
    owner_id,
    title,
    creationDate,
    status,
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
      const insertTask =
        "INSERT INTO task (user_id, creation_date) VALUES ($1, $2) RETURNING id";
      await client.query(insertTask, [this.owner_id, this.creationDate]);
      const taskId = rows[0].findId;

      const insertTaskProp =
        "INSERT INTO task_properties (task_id, title, due_date, status, subtasks, priority";
      // il faut que je fasse le cas où une props = undifined et que je fasse gaffe à la date
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
  static async find() {}
  static async findId() {}
  static async getData() {}
  static async delete() {}
}
