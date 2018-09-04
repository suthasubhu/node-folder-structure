const User = require('../models/User');
const crypto = require('crypto');
const errors = require ('../errors/errors.js');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;

exports.findUserExistance = (email) => {
    const query = { email: _.toLower(email) }
    return User.findOne(query)
};

async function generatePassword(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return { salt, value };
}

exports.login = async(req, data, next) => {
    let email = _.get(req.body, 'email', 'null').toLowerCase(),
        password = _.get(req.body, 'password', 'null'),
        userData;
    const hash = crypto.createHmac('sha512', data.salt);
    hash.update(password);
    const value = hash.digest('hex');
    const query = { email };
    userData = await User.findOne(query);
    userData = userData.toObject();
    if (!_.isEqual(userData.password, value) && (userData.email, email)) {
        throw new errors.InvalidEmailOrPassword();
    }
    userData = _.omit(userData, [ 'salt', 'password' ]);
    return userData;
};

exports.register = async(req) => {
    const password = _.get(req, 'body.password');
    const passwordData = await generatePassword(password);
    let userData = new User({
        name: _.get(req, 'body.name'),
        email: _.get(req, 'body.email').toLowerCase(),
        password: passwordData.value,
        phone: _.get(req, 'body.phone'),
        salt: passwordData.salt,
    })
    let data = await userData.save();
    data = data.toObject();
    data = _.omit(data, [ 'salt', 'password' ]);
    return data;
}