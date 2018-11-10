/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2017-11-04 11:23:27
 *****************************************
 */
'use strict';



/*
 ****************************************
 * 加载依赖
 ****************************************
 */
const
    os = require('os');


/*
 ****************************************
 * 定义获取【ip】方法
 ****************************************
 */
function ip() {
    let network = os.networkInterfaces(),
        keys = Object.keys(network),
        ips = [];

    for (let key of keys) {
        network[key].forEach(ip => {
            ip.family === 'IPv4' && !ip.internal && ips.push(ip.address);
        });
    }

    return ips.length ? ips[0] : '127.0.0.1';
}


/*
 ****************************************
 * 抛出接口
 ****************************************
 */
module.exports = ip;
