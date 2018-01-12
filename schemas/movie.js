const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    year: Number,
    summary: String,
    poster: String,
    flash: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        update: {
            type: Date,
            default: Date.now()
        }
    }
});


