const { CustomError } = require("$/errors/CustomError");

class MatchFetchPlayersError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't fetch players. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { MatchFetchPlayersError };
