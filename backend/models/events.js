const { Schema, Types, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    general_location: { type: String, required: true },
    type: {
      public: { type: Boolean, default: false },
      private: { type: Boolean, default: false },
    },
    is_active: { type: Boolean, default: true },
    date: { type: Date },
    eventPic: { type: String },
    participants: { type: Number },
    author: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = {
    Event,
};
