const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 2, maxLength: 25, match: [/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'Please enter a valid title'] },
  author: { type: String, required: true, match: [/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'Please enter a valid name'] },
  email: { type: String, required: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'] },
  src: { type: String, required: true },
  votes: { type: Number, required: true },
});

module.exports = mongoose.model('Photo', photoSchema);
