/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-05-31 15:43:52
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('./fs'),
    promisify = require('./promisify'),
    xml2js = require('xml2js'),
    parse = promisify(xml2js.parseString),
    builder = new xml2js.Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8' }
    });


/**
 *****************************************
 * 字符串化
 *****************************************
 */
function stringify(data = {}) {
    return builder.buildObject(data);
}


/**
 *****************************************
 * 解析【xml】文档
 *****************************************
 */
async function readFile(file) {
    return await parse(await fs.readFile(file));
}


/**
 *****************************************
 * 保存【xml】文档
 *****************************************
 */
async function writeFile(file, data) {
    return await fs.writeFile(file, stringify(data));
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = {
    parse,
    stringify,
    readFile,
    writeFile
};
