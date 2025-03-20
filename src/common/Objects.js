function isEmpty(obj) {
    if (obj == null || obj == '') {
        return true;
    }
    return false;
}

function isNumber(value) {
    return /^\d+$/.test(value);
}


function isCOSUrl(urlStr) {
    let isCos = false;
    try {
        //创建一个正则表达式来匹配URL中的域名部分
        const myDomainRegexArr = [/https?:\/\/[^\/]+\.myqcloud\.com/, /^https:\/\/dighum-cos\.aith\.chat\/.*$/, /^https:\/\/dighum-cos-cdn\.aith\.chat\/.*$/];
        myDomainRegexArr.forEach(regex => {
            if (regex.test(urlStr)) {
                isCos = true;
            }
        })
        return isCos;
    } catch (e) {
        // 如果提供的不是有效的URL字符串，返回false
        return false;
    }
}

function isResChecked(checkedVar, index) {
    if (checkedVar.value != -1 && checkedVar.value == index) {
        return true;
    }
    return false;
}

export { isEmpty, isNumber, isCOSUrl, isResChecked }