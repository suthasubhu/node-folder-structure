'use strict';

function InvalidEmail() {
    this.getMessage = function() {
        return "Invalid Password";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(InvalidEmail, Error);

module.exports = InvalidEmail;