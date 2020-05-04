'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
    username: String,
    email: String,
    phone: String,
    verification: {
        mobile: {
            otp: String,
            status: { type: Boolean, default: false }, //verification status
            verifiedDate: Date
        },
        email:{
            otp: String,
            status: { type: Boolean, default: false }, //verification status
            verifiedDate: Date
        }
    },
    password: String,
    prof_pic_url : String,
    role:String,
    user_group_id:{ type: Schema.Types.ObjectId, ref: 'user-groups' },
    status:{type:Boolean, default: false},
    created_date: { type: Date, default: Date.now },
    last_logged_in : { type: Date },
    updated_date: { type: Date}
});

module.exports = mongoose.model('users', schema);