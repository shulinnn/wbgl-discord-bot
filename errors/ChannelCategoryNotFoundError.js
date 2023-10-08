const { CustomError } = require("$/errors/CustomError");

class ChannelCategoryNotFoundError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't get event channel category. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = { ChannelCategoryNotFoundError };
