import pool from "../config/dbConfig.js";

class Section {
  constructor(name, user_id) {
    this.name = name;

    this.user_id = user_id;
  }

  async save() {
    const client = await pool.connect();
    console.log(this);
    try {
      await client.query("BEGIN");

      const query = "INSERT INTO section (name, user_id) VALUES ($1, $2)";

      await client.query(query, [this.name, this.user_id]);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }

  static async find(
    user_id = undefined,
    name = undefined,
    sectionId = undefined
  ) {
    if (!user_id && !sectionId) {
      throw new Error(
        "You have to provide a parameter (name | userId or sectionId)!"
      );
    }
    try {
      const query = sectionId
        ? "SELECT * FROM section WHERE id = $1"
        : name
        ? "SELECT * FROM section WHERE name = $1 AND user_id = $2"
        : "SELECT * FROM section WHERE user_id = $1";

      const params = sectionId
        ? [sectionId]
        : name
        ? [name, user_id]
        : [user_id];

      console.log(query, user_id, name, sectionId);
      const { rows } = await pool.query(query, params);
      console.log(rows);
      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(newName, sectionId, userId) {
    console.log("new Name: ", newName);
    console.log("Section ID: ", sectionId);
    console.log("userID: ", userId);
    const [currentSection] = await this.find(undefined, undefined, sectionId);

    if (!currentSection) {
      console.error("Section not found (Section.update)");
      throw new Error("Section not found");
    }
    if (newName === currentSection.name) {
      return;
    }
    const query = `UPDATE section SET name = $1 WHERE id = $2 AND user_id = $3`;
    const params = [newName, sectionId, userId];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Error updating section:", error);
      throw new Error("Failed to update section");
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const deleteQuery = "DELETE FROM section WHERE id = $1";
      await client.query(deleteQuery, [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23503") {
        // Lever une erreur spécifique pour être attrapée par le contrôleur
        throw new Error(
          "You cannot delete this section because there are still tasks in it!"
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Section;
