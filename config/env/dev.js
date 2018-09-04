'use strict';

module.exports = {
    app: {
        publicResources: [
            '/',
            '/auth/signin',
            '/auth/user',
        ],
    },
    environment: 'dev',
    port: 7000,
    db: {
        host: 'localhost:27017',
        name: 'db',
        username: '',
        password: '',
        connectionTimeout: 3000,
    },
    mail: {
        host: '',
        port: 587,
        user: "",
        pass: "",
    },
    JWTSecretKey: 'VQuGMDwLXfJXEDhAqleOlL6BtiUhRnKz',
};
