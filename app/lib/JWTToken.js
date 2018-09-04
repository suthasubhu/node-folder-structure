'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/env/dev');
const secretKey = config.JWTSecretKey;
const _ = require('lodash');
const User = require('../models/User');
const errors = require('../errors/errors');

exports.getToken = (data) => {
    return new Promise((resolve, reject) => {
        var token = jwt.sign(data, secretKey);
        resolve(token);
    });
};

exports.decodeToken = (req) => {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.auth, secretKey, function(err, decoded) {
            if (err) {
                return reject("Invalid Token");
            }
            if (!_.isEmpty(decoded['user'])) {
                return resolve(decoded['user']);
            }
            return reject("Invalid Token");
        });
    });
};

exports.validateLogin = (req) => {
    let self = this;
    return self.decodeToken(req)
        .then(data => {
            const query = { email: _.get(data, 'email', null) };
            return User.findOne(query)
        })
        .then(data => {
            if (_.isEmpty(data)) {
                throw new errors.InvaidToken();
            }
            return data;
        })
}
        