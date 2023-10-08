const { CustomError } = require("$/errors/CustomError");

class MatchChannelCreationError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't create match channel. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { MatchChannelCreationError };
