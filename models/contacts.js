import { Schema, model } from "mongoose";

export const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
  },
  { versionKey: false, timestamps: false }
);

const Contact = model("Contact", contactSchema);
export default Contact;
