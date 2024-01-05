const Sequelize = require('sequelize');
const database = require('../../database/db');
const Schema = require('./schemas/movie-request');

const Movie = database.define('movie', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  studios: {
    type: Sequelize.STRING,
    allowNull: false
  },
  producers: {
    type: Sequelize.TEXT,
    get() {
      const toString = this.getDataValue('producers');
      return toString ? JSON.parse(toString) : [];
    },
    set(producers) {
      this.setDataValue('producers', JSON.stringify(producers));
    },
  },
  winner: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: true
  },
});

Movie.schema = Schema;

module.exports = Movie;