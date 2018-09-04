'use strict';

function InvalidPhoneNumber() {
    this.getMessage = function() {
        return "Invalid Phone Number";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(InvalidPhoneNumber, Error);

module.exports = InvalidPhoneNumber;