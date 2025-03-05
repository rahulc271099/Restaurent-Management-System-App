// src/events/tableEvent.js
const EventEmitter = require('events');

class TableEventEmitter extends EventEmitter {}
const tableEvents = new TableEventEmitter();

module.exports = tableEvents;