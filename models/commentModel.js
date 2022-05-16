const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/Test';

mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("open", () => { console.log("Database connected!") });

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment


