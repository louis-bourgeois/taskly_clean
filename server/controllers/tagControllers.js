import Tag from "../models/Tag";

export async function addTag(req, res) {
  try {
    const user = req.user;

    const found_user = await User.findId(undefined, user.email, undefined);

    const userId = found_user[0][0];

    const name = req.body.name;

    const tag = new Tag(name, userId);
    await Tag.save();
    const user_tags = await Tag.find(userId);
    res
      .status(200)
      .json({ message: "Tag added successfully", tags: user_tags });
  } catch (error) {
    console.error(error);
  }
}

export async function updateTag(req, res) {}

export async function deleteTag(req, res) {}
