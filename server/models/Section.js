import pool from "../config/dbConfig.js";

class Section {
  constructor(name, id, user_id) {
    this.name = name;
    this.user_id = user_id;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = "INSERT INTO section (name, user_id) VALUES ($1,$2)";

      await client.query(query, [this.name, this.user_id]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  static async find(user_id, name = "") {
    try {
      const query = name
        ? "SELECT * FROM section WHERE name = $1 AND user_id = $2"
        : "SELECT * FROM section WHERE user_id = '0ee28fa5-0cf9-470a-b388-7bc11733437d'";
      const params = name ? [name, user_id] : [user_id];

      const { rows } = await pool.query(query);

      return rows;
    } catch (error) {
      throw error;
    }
  }
}
export default Section;
