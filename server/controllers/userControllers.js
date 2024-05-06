import User from "../models/User.js";

export async function checkUser(req, res, next) {
  const result = await User.find({
    email: req.body.email,
  });
  if (result) {
    req.body.db_hash_password = result[2];
    delete req.body.email;
    next();
  } else {
    res.status(404).send("User not found");
  }
}

export async function createUser(req, res) {
  const result = await User.find(req.body.data, true);

  if (result === true) {
    res.send("already exist");
  } else if (result === "username already taken") {
    res.send(result);
  } else {
    try {
      const data = req.body.data;

      const user = new User(
        data.username,
        data.fName,
        data.lName,
        data.email,
        data.hashPassword
      );
      user.save();
    } catch (e) {
      res.send();
    }
    res.status(200).send("User created successfully");
  }
}
export async function getUserData(req, res) {
  const result = await User.getData("all", req.body.id);

  if (result) {
    res.send(result);
  } else {
    res.status(404).send("User not found");
  }
}
