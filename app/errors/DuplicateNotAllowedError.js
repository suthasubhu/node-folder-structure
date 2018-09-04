'use strict';

function DuplicateNotAllowedError() {
    this.getMessage = function() {
        return "Duplicate data not allowed";
    };
    this.getStatusCode = function() {
        return 400;
    };
}

require("util").inherits(DuplicateNotAllowedError, Error);

module.exports = DuplicateNotAllowedError;
