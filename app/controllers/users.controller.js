'use strict';

const userService = require('../services/user.service');
const errors = require ('../errors/errors.js');
const _ = require('lodash');
const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const phoneNumberPattern = /^([()\- x+]*\d[()\- x+]*){3,16}$/;
const jwtToken = require('../lib/JWTToken');
exports.registerValidation = (req) => {
    return new Promise((resolve, reject) => {
        if (_.isEmpty(_.get(req, 'body.name')) ||
			_.isEmpty(_.get(req, 'body.email')) ||
			_.isEmpty(_.get(req, 'body.phone')) ||
			_.isEmpty(_.get(req, 'body.password'))
        ) {
            reject(new errors.RequiredParamsNotFoundError());
        } else if (!emailPattern.test(_.get(req, 'body.email'))) {
            reject(new errors.InvalidEmail());
        } else if (_.get(req, 'body.password').length < 6) {
            reject(new errors.InvalidPassword());
        } else if (!phoneNumberPattern.test(_.get(req, 'body.phone'))) {
            reject(new errors.InvalidPhoneNumber());
        } else {
            resolve(req);
        }
    });
};

exports.register = async(req, res) => {
    try {
        await this.registerValidation(req);
        const data = await userService.findUserExistance(_.get(req, 'body.email', ''));
        if (!_.isEmpty(data)) {
            throw new errors.UserExistError;
        }
        const userData = await userService.register(req);
        const tokenData = { user: { id: userData._id, email: userData.email, createdAt: new Date() } };
        const token = await jwtToken.getToken(tokenData);
        res.cookie('auth', token);
        return res.success(res, userData);
    } catch (err) {
        if (
            (err instanceof errors.UserExistError) ||
            (err instanceof errors.InvalidPhoneNumber) ||
            (err instanceof errors.RequiredParamsNotFoundError) ||
            (err instanceof errors.InvalidEmail) ||
            (err instanceof errors.InvalidPassword)
        ) {
            return res.message(res, err.getStatusCode(), err.getMessage());
        }
        return res.message(res, 500, err.message || err.stack || err);
    }
}

exports.login = async(req, res, next) => {
    try {
        if (_.isEmpty(_.get(req, 'body.email')) ||
			_.isEmpty(_.get(req, 'body.password'))
        ) {
            throw new errors.RequiredParamsNotFoundError;
        }
        const data = await userService.findUserExistance(_.get(req, 'body.email', ''));
        if ((_.isEmpty(data))) {
            throw new errors.UserNotFoundError();
        }
        if (data.isDeleted || !data.isActive) {
            throw new errors.AccountDeactiveError();
        }
        const userData = await userService.login(req, data);
        let tokenData = { user: { id: data._id, email: data.email, createdAt: new Date() } };
        const token = await jwtToken.getToken(tokenData);
        res.cookie('auth', token);
        return res.success(res, userData);
    } catch (err) {
        if (
            (err instanceof errors.UserNotFoundError) ||
                (err instanceof errors.AccountDeactiveError) ||
                (err instanceof errors.RequiredParamsNotFoundError) ||
                (err instanceof errors.InvalidEmailOrPassword)
        ) {
            return res.message(res, err.getStatusCode(), err.getMessage());
        }
        return res.message(res, 500, err.message || err.stack || err);
    }
}

exports.logout = async(req, res) => {
    try {
        await jwtToken.decodeToken(req);
        res.clearCookie('auth');
        return res.success(res, "Logged out successfully");
    } catch (err) {
        return res.message(res, 500, err.message || err.stack || err);
    }
}

exports.getUser = async(req, res) => {
    try {
        await jwtToken.decodeToken(req);
        let userData = await jwtToken.validateLogin(req);
        userData = userData.toObject();
        userData = _.omit(userData, [ 'salt', 'password' ]);
        return res.success(res, userData);
    } catch (err) {
        if ((err instanceof errors.InvaidToken)) {
            res.clearCookie('auth');
            return res.message(res, err.getStatusCode(), err.getMessage());
        }
        return res.message(res, 500, err.message || err.stack || err);
    }
}
