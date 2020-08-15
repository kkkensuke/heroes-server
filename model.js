const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/heroes");

const HeroesModelSchema = new mongoose.Schema({
  id: Number,
  name: String
});

module.exports = mongoose.model('heroes', HeroesModelSchema);