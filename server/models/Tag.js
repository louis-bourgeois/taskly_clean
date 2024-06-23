import pool from "../config/dbConfig.js";

class Tag {
  constructor(name, user_id) {
    this.name = name;
    this.user_id = user_id;
  }

  async save() {
    const client = await pool.connect();
    console.log(this);
    try {
      await client.query("BEGIN");

      const query = "INSERT INTO tag (name, user_id) VALUES ($1, $2)";

      await client.query(query, [this.name, this.user_id]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }

  static async find(user_id = undefined, name = undefined, tagId = undefined) {
    if (!user_id && !sectionId) {
      throw new Error(
        "You have to provide a parameter (name | userId or tagId)!"
      );
    }
    try {
      const query = tagId
        ? "SELECT * FROM tag WHERE id = $1"
        : name
        ? "SELECT * FROM tag WHERE name = $1 AND user_id = $2"
        : "SELECT * FROM tag WHERE user_id = $1";

      const params = tagId ? [tagId] : name ? [name, user_id] : [user_id];

      console.log(query, user_id, name, tagId);
      const { rows } = await pool.query(query, params);
      console.log(rows);
      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(newName, tagId, userId) {
    console.log("new Name: ", newName);
    console.log("Tag ID: ", tagId);
    console.log("userID: ", userId);
    const [currentTag] = await this.find(undefined, undefined, tagId);

    if (!currentTag) {
      console.error("Tag not found (Section.update)");
      throw new Error("Tag not found");
    }
    if (newName === currentTag.name) {
      return;
    }
    const query = `UPDATE tag SET name = $1 WHERE id = $2 AND user_id = $3`;
    const params = [newName, tagId, userId];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Error updating tag:", error);
      throw new Error("Failed to update tag");
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const deleteQuery = "DELETE FROM tag WHERE id = $1";
      await client.query(deleteQuery, [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23503") {
        throw new Error(
          "You cannot delete this tag because there are still tasks in it!"
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Tag;
