const { CustomError } = require("$/errors/CustomError");

class EventNotFoundError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Event not found. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { EventNotFoundError };
