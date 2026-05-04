const mongoose = require('mongoose');
const { Embeddings } = require('openai/resources/embeddings.js');

const chunkSchema = new mongoose.Schema({
    text: String,
    embedding: [Number],
    fileName: String,
});

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chunks: [chunkSchema]
});

module.exports = mongoose.model("Document", documentSchema)