/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-01 11:40:11
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const crypto = require('crypto');


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { md5, sha1, hmac };


/**
 *****************************************
 * 【md5】加密
 *****************************************
 */
function md5(str, encoding = 'hex') {
    return crypto.createHash('md5').update(str, 'utf8').digest(encoding);
}


/**
 *****************************************
 * 【sha1】加密
 *****************************************
 */
function sha1(str, encoding = 'hex') {
    return crypto.createHash('sha1').update(str, 'utf8').digest(encoding);
}


/**
 *****************************************
 * 【hmac】加密
 *****************************************
 */
function hmac(str, secret = '', encoding = 'hex') {
    return crypto.createHmac('sha256', secret).update(str, 'utf8').digest(encoding);
}

