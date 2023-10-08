const { CustomError } = require("$/errors/CustomError");

class EventAlreadyJoinedError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ You are already in this event. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { EventAlreadyJoinedError };
