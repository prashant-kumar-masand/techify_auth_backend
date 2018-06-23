/**
 * Model for creating User 
 */
var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    email: {
        type: String,
        default: "",
        trim: true,
    },
    name: {
        type: String,
        default: "",
    },
    role: {
        type: String,

        trim: true
    },
    password: {
        type: String,

        trim: true
    },
    accessToken: {
        type: String,
        default: ""
    }
}, {
        strict: true,
        collection: 'user',
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });
module.exports = mongoose.model("user", userSchema);