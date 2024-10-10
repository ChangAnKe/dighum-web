function isEmpty(obj) {
    if (obj == null || obj == '') {
        return true;
    }
    return false;
}

function isNumber(value) {
    return /^\d+$/.test(value);
}

export { isEmpty, isNumber }