'use strict';

function UserNotFoundError() {
    this.getMessage = function() {
        return "User Not Found";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(UserNotFoundError, Error);

module.exports = UserNotFoundError;