const { Race } = require("@prisma/client");

class CreateMatchCommandOptions {
  constructor() {
    this.event = null;
    this.players = null;
    this.races = null;
    this.score = null;
    this.map = null;
    this.matchType = null;
    this.racesBool = null;
    this.channelCategory = null;
    this.channel = null;
  }

  setEvent(event) {
    this.event = event;
    return this;
  }
  setPlayers(players) {
    this.players = players;
    return this;
  }
  setRaces(races) {
    this.races = races;
    return this;
  }
  setScore(score) {
    this.score = score;
    return this;
  }
  setMap(map) {
    this.map = map;
    return this;
  }
  setMatchType(matchType) {
    this.matchType = matchType;
    return this;
  }
  setRacesBool(racesBool) {
    this.racesBool = racesBool;
    return this;
  }
  setChannelCategory(channelCategory) {
    this.channelCategory = channelCategory;
    return this;
  }
  setChannel(channel) {
    this.channel = channel;
    return this;
  }

  doesExist() {
    if (this.event === null) return false;
    else return true;
  }

  arePlayersSame() {
    if (this.players.player1 === this.players.player2) return true;
    else return false;
  }

  areRacesRandom() {
    if (this.racesBool) return true;
    else return false;
  }

  generaceRaces() {
    var races = ["Human", "Undead", "NightElf", "Orc"];
    const possibleRaces = Object.values(races);
    this.setRaces([
      possibleRaces[Math.floor(Math.random() * possibleRaces.length)],
      possibleRaces[Math.floor(Math.random() * possibleRaces.length)],
    ]);
  }

  defaultRaces() {
    this.setRaces([Race.TBA, Race.TBA]);
  }
}

module.exports = {
  CreateMatchCommandOptions,
};
