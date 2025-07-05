require("dotenv").config();
const User = require("../models/userModel");

const listUsers = async (req, res) => {
  const searchQuery = req.query.q || "";
  const isAjax = req.headers["x-requested-with"] === "fetch";

  let query = {};
  if (searchQuery) {
    query = {
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query).lean();

  if (isAjax) {
    return res.json({ users });
  }

  res.render("admin/users", { users });
};

const toggleUserStatus = async (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;
  try {
    await User.updateOne({ _id: id }, { $set: { isActive } });
    res.status(200).json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

const userDetails = async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id });
  // let address = await Address.findOne({_id:id})
};

module.exports = {
  listUsers,
  toggleUserStatus,
  userDetails,
};
