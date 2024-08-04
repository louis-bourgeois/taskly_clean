import Preference from "../models/Preference.js";
import User from "../models/User.js";

export async function updatePreference(req, res) {
  console.log("update");
  if (req.user) {
    try {
      const found_user = await User.findId(
        undefined,
        req.user.email,
        undefined
      );
      const userId = found_user[0][0];

      await Preference.update(userId, req.body.key, req.body.value);
      const preferences = await Preference.getUserPreferences(userId, "*");
      res.status(200).send(preferences);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating user preference", error: error });
    }
  } else {
    res
      .status(401)
      .json({ message: "Please refresh the page, user is not authenticated." });
  }
}

export async function addPreference(req, res) {
  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const newPreference = await new Preference(
      req.body.key,
      req.body.value,
      userId
    );
    await newPreference.save();
    res.send(201);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating user preference", error: error });
  }
}

export async function getUserPreferences(req, res) {
  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const keys = req.body.keys || "*";
    const preferences = await Preference.getUserPreferences(userId, keys);
    return res.status(200).json({ preferences: preferences });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting user preference", error: error });
  }
}
