const { CustomError } = require("$/errors/CustomError");

class EventAlreadyStartedError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Can't join started event. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { EventAlreadyStartedError };
