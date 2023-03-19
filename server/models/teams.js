const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true,
  },
  team_member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  event_id: {
    type: String,
  },
  event_name: {
    type: String,
  },
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
