/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

'use strict';

// 支付宝文档地址：https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.0vF4aj&treeId=60&articleId=104790&docType=1#s5
var crypto = require('crypto'), // 加密模块
    querystring = require('querystring'),
    https = require('https'),
    payConf = require('../../conf/alipay'),
    getMySign = function(params) { // 根据对象参数、Key，依据支付宝规范生成验证码sign
        var arr = [];
        for (let key in params) {
            // 筛选,获取所有请求参数,不包括字节类型参数,如文件、字节流,剔除sign与sign_type参数。
            // 按照'参数=参数值'的模式用'&'字符拼接成字符串。
            if (!params[key] || key === 'sign' || key === 'sign_type') {
                continue;
            }
            arr.push(key + '=' + params[key]);
        }
        // 把拼接后的字符串再与安全校验码直接连接起来,然后用utf-8的编码格式MD5加密
        return crypto.createHash('MD5').update(arr.sort().join('&') + payConf.key, payConf.input_charset).digest('hex');
    },
    alipayVerity = function(params, callback) { // 验证支付宝返回的参数
        var mysign = getMySign(params);
        // mysign与sign不等,与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
        console.log('支付宝返回参数：', params);
        if (params.notify_id && (params.sign === mysign)) {
            let veryfy_path = [
                payConf.HTTPS_VERIFY_PATH,
                'partner=',
                payConf.partner,
                '&notify_id=',
                params.notify_id
            ].join('');
            httpsReq(veryfy_path, respons => {
                callback(respons ? true : false);
            });
        } else {
            console.log('支付宝返回参数验证错误', 'sign:', params.sign, 'mysign:', mysign);
            callback(false);
        }
    },
    httpsReq = function(path, callback) { // 自定义请求方法https
        var options = {
            host: payConf.ALIPAY_HOST,
            port: 443,
            path: path,
            method: 'GET'
        };
        try {
            var req = https.request(options, res => {
                console.log('https请求，statusCode: ', res.statusCode, 'headers:', res.headers);
                // 这里需要判断statusCode的状态
                res.on('data', data => {
                    console.log('https请求完成：', data);
                    callback(data);
                });
            });
        } catch (e) {
            console.log('支付https请求错误：', e);
        };
        req.end();
        req.on('error', e => {
            console.error('请求出错：', e);
            callback(false);
        });
    };

module.exports = {
    // 开始支付
    start: (req, res) => {
        var _data = JSON.parse(req.query.data);
        console.log('支付详情-在线支付', _data);
        // ===================
        // 把请求参数打包成对象(不包括sign和sign_type)
        // 自定义参数放在 return_url 后面
        var sParaTemp = { // 基本参数
            service: payConf.service,
            partner: payConf.partner,
            _input_charset: payConf._input_charset,
            // notify_url: payConf.notify_url,
            return_url: `${payConf.return_url}?userparam=test`,
            seller_id: payConf.partner,
            payment_type: payConf.payment_type,
            out_trade_no: _data.orderSn, // '商户网站唯一订单号-String(64)'
            subject: _data.orderSn, // '商品名称-String(256)' 由于java接口原因目前用订单号代替
            total_fee: _data.userPay.toFixed(2), // '交易金额取值范围为[0.01,100000000.00],精确到小数点后两位-String'
            show_url: 'http://wode299.com/' // '商品展示网址,收银台页面上,商品展示的超链接。-String(400)'
        };

        console.log(sParaTemp.return_url);

        // 加上sign sign_type
        sParaTemp.sign = getMySign(sParaTemp);
        sParaTemp.sign_type = payConf.sign_type;

        // 发起支付请求路径
        var payUrl = ['https://',
            payConf.ALIPAY_HOST,
            '/',
            payConf.ALIPAY_PATH,
            '?',
            querystring.stringify(sParaTemp)
        ].join('');

        // 向支付宝网关发出请求
        res.redirect(payUrl);
    },
    // 支付宝对商户的请求数据处理完成后,会将处理的结果数据通过系统程序控制客户端页面自动跳转的方式通知给商户网站。这些处理结果数据就是页面跳转同步通知参数。
    return: (req, res) => {
        var params = req.query, // 支付宝异步通知返回GET参数对象
            trade_status = params.trade_status; // 交易状态
        console.log('=====================支付宝支付成功跳转页面返回参数:');
        console.log(params);
        var _returnData = { // 返回给页面的对象
            status: true,
            msg: '支付成功',
            data: {
                orderSn: params.out_trade_no,
                expectedTime: params.expectedtime,
                device: params.device,
                discountId: params.discountid
            }
        };
        // 删除自定义参数(已保证支付宝参数验证正确)
        delete params.userparam;

        alipayVerity(params, status => {
            if (status && (trade_status === 'TRADE_FINISHED' || trade_status === 'TRADE_SUCCESS')) {
                // 支付成功 -  可以在这里处理业务逻辑
            } else {
                _returnData.status = false;
                _returnData.msg = '支付失败';
            }
            res.render('common/payreturn', _returnData);
        });
    },
    // 支付宝异步通知
    notify: (req, res) => {
        // 参考支付宝开放平台文档中心
        var params = req.query; // 支付宝异步通知返回GET参数对象
        console.log('支付宝异步通知参数：', params);
        alipayVerity(params, status => {
            if (status && (trade_status == 'TRADE_FINISHED' || trade_status == 'TRADE_SUCCESS')) {
                // 判断该笔订单是否在商户网站中已经做过处理，如果没有做过处理,根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细,并执行商户的业务程序，如果有做过处理,不执行商户的业务程序
                res.end('success');
            } else {
                res.end('fail');
            }
        });
    }
};
