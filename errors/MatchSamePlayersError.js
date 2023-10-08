const { CustomError } = require("$/errors/CustomError");

class MatchSamePlayersError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Same players on each team isn't allowed. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { MatchSamePlayersError };
