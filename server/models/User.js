import pool from "../config/dbConfig.js";
import { isUUID } from "../utils/validate.js";
import Section from "./Section.js";
import Task from "./Task.js";

class User {
  constructor(
    username,
    firstName,
    lastName,
    email,
    password_hash,
    phone_number = undefined
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone_number = phone_number;
    this.password_hash = password_hash;
  }

  async save() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertUserProfile =
        "INSERT INTO user_profile (username, creation_date, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id";
      const { rows } = await client.query(insertUserProfile, [
        this.username,
        new Date().toISOString(),
        this.firstName,
        this.lastName,
      ]);
      const userId = rows[0].id;

      const insertUserSecurity =
        "INSERT INTO user_security (id, password_hash) VALUES ($1, $2)";
      await client.query(insertUserSecurity, [userId, this.password_hash]);

      if (this.phone_number) {
        const query =
          "INSERT INTO user_contact (user_id, email, phone_number) VALUES ($1, $2, $3);";
        await client.query(query, [userId, this.email, this.phone_number]);
      } else {
        const query =
          "INSERT INTO user_contact (user_id, email) VALUES ($1, $2);";
        await client.query(query, [userId, this.email]);
      }
      const insertSection =
        "INSERT INTO section (name, user_id) VALUES ($1,$2)";
      await client.query(insertSection, ["Other", userId]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  static async find(criteria, bool = false) {
    const result = await this.findId(
      criteria.username,
      criteria.email,
      criteria.phone_number,
      criteria.id
    );
    if (!result) {
      return undefined;
    }

    let result_clean = [];

    for (const r of result) {
      if (bool) {
        if (r.length === 2) {
          return "username already taken";
        }
        return true;
      } else {
        result_clean.push(r[0]);
      }
    }
    let users = [];

    for (const id of result_clean) {
      const userData = await this.getData("all", id);
      if (!userData) {
        continue;
      }

      const hash_password = await this.getHashPassword(id);
      const tasks = await this.getTasks(id);
      userData.tasks = tasks;
      userData.sections = await Section.find(id);
      users.push(id, userData, hash_password);
    }

    return users;
  }

  static async getData(data, id) {
    const validColumns = {
      all: "user_profile.username, user_profile.first_name, user_profile.last_name, user_contact.email, user_contact.phone_number, user_preferences.preferred_language, user_preferences.second_language",
      username: "user_profile.username",
      first_name: "user_profile.first_name",
      last_name: "user_profile.last_name",
      email: "user_contact.email",
      phone_number: "user_contact.phone_number",
      preferred_language: "user_preferences.preferred_language",
      second_language: "user_preferences.second_language",
    };

    if (!(data in validColumns)) {
      throw new Error("Invalid data request");
    } else if (!isUUID(id)) {
      throw new Error("invalid ID");
    }

    const query = `SELECT ${validColumns[data]} FROM user_profile
                   LEFT JOIN user_contact ON user_profile.id = user_contact.user_id
                   LEFT JOIN user_preferences ON user_profile.id = user_preferences.user_id
                   WHERE user_profile.id = $1`;
    const { rows } = await pool.query(query, [id]);

    return rows[0];
  }

  static async getSections(id) {
    if (id) {
      try {
        const section = await Section.find(id);
        return section;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  static async getTasks(id) {
    if (id) {
      try {
        const tasks = await Task.find(id);
        return tasks;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("no id");
    }
  }
  static async getHashPassword(id) {
    if (!isUUID(id)) {
      throw new Error("Invalid id provided.");
    }
    try {
      const result = await pool.query(
        "SELECT password_hash FROM user_security WHERE id = $1",
        [id]
      );
      if (result.length > 1) {
        res.send(401);
      }
      return result.rows[0].password_hash;
    } catch (error) {
      res.send(401);
    }
  }
  static async findId(
    username = undefined,
    email = undefined,
    phone_number = undefined
  ) {
    const searchCriteria = [
      {
        value: email,
        query:
          "SELECT user_profile.id FROM user_profile JOIN user_contact ON user_profile.id = user_contact.user_id WHERE user_contact.email = $1",
      },
      {
        value: username,
        query: "SELECT id FROM user_profile WHERE username = $1",
      },
      {
        value: phone_number,
        query:
          "SELECT user_profile.id FROM user_profile JOIN user_contact ON user_profile.id = user_contact.user_id WHERE user_contact.phone_number = $1",
      },
    ];

    let foundIds = [];
    for (let criterion of searchCriteria.filter((c) => c.value !== undefined)) {
      try {
        const { rows } = await pool.query(criterion.query, [criterion.value]);
        rows.forEach((row) => {
          if (!foundIds.includes(row.id)) {
            if (criterion.value === username) {
              foundIds.push([row.id, "username taken"]);
            } else {
              foundIds.push([row.id]);
            }
          }
        });
      } catch (error) {
        console.error("Error executing query:", error.stack);
      }
    }

    if (foundIds.length > 0) {
      return foundIds;
    } else {
      return false;
    }
  }
}

export default User;
