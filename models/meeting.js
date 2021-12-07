const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    date: {
      type: String,
      required: true
    },

    startTime: {
        type: Number,
        required: true
    },

    endTime: {
        type: Number,
        required: true
    }
    
  },

  {
    collection: "meetings"
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
