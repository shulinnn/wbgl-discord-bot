const { CustomError } = require("$/errors/CustomError");

class MatchCreateError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't create the match record. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { MatchCreateError };
