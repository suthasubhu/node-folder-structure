'use strict';

function RequiredParamsNotFound() {
    this.getMessage = function() {
        return "Required params Not Found";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(RequiredParamsNotFound, Error);

module.exports = RequiredParamsNotFound;