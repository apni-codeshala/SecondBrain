import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
