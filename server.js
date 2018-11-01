/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-01 10:35:15
 *****************************************
 */
'use strict';


/**
 *****************************************
 *  加载依赖
 *****************************************
 */
const express = require('express');
const bodyParser = require('body-parser');


/**
 *****************************************
 * 创建服务器
 *****************************************
 */
function server() {
    let app = express();

    // 加载中间件
    app.use(express.static('public'));
    app.use(express.static('static'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // 返回结果
    return app;
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = server;
