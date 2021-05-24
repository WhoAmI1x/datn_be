function isPhoneNumber(phoneNumber) {
    var regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (phoneNumber.match(regex)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = isPhoneNumber;