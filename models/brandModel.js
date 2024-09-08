const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  categoryName: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const Brand = mongoose.model("Brands", brandSchema);

module.exports = Brand;
