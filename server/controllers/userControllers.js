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
  console.log("====================================");
  console.log("3 (createUser)", req.body);
  console.log("====================================");
  const result = await User.find(req.body.data, true);
  console.log("====================================");
  console.log("4 result of User : undefined = expected", result);
  console.log("====================================");
  if (result === true) {
    res.send("already exist");
  } else if (result === "username already taken") {
    res.send(result);
  } else {
    try {
      const data = req.body.data;
      console.log("====================================");
      console.log("5 creation of a user with this data : ", req.body.data);
      console.log("====================================");
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
  console.log("appelé!!!!!!! ", req.body);
  const result = await User.getData("all", req.body.id);
  console.log("result", result);
  if (result) {
    res.send(result);
  } else {
    res.status(404).send("User not found");
  }
}
