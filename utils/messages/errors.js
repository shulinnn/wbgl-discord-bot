const chalk = require("chalk");

class CustomError extends Error {
  constructor() {
    super();
    this.name = chalk.red("[" + EventNotFoundError.name + "]");
  }
}

class EventNotFoundError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Event not found. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class MatchSamePlayersError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Same players on each team isn't allowed. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class MatchChannelCreationError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't create match channel. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class MatchCreateError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't create the match record. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class ChannelCategoryNotFoundError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't get event channel category. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}
class MatchFetchPlayersError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Couldn't fetch players. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class EventAlreadyStartedError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ Can't join started event. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

class EventAlreadyJoinedError extends CustomError {
  constructor(interaction) {
    super(interaction);
    this.message = `❌ You are already in this event. ❌`;
    interaction.editReply({ content: this.message, ephemeral: true });
  }
}

module.exports = {
  MatchSamePlayersError,
  MatchChannelCreationError,
  MatchCreateError,
  ChannelCategoryNotFoundError,
  MatchFetchPlayersError,
  EventNotFoundError,
  EventAlreadyStartedError,
  EventAlreadyJoinedError,
};
