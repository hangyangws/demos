/**
 * 支付宝文档接口：
 * https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.0vF4aj&treeId=60&articleId=104790&docType=1#s5
 */

var crypto = require('crypto'), // 加密模块
    querystring = require('querystring'),
    payConf = { // 支付配置
        ALIPAY_HOST: 'mapi.alipay.com', // 接口域名地址
        ALIPAY_PATH: 'gateway.do', // 接口路径
        input_charset: 'utf-8', // 字符集、加密方式
        sign_type: 'MD5',
        notify_url: 'http://127.0.0.1:3000/alipay/notify', // 支付宝服务器通知的页面,http://格式的完整路径,不允许加?id:123这类自定义参数(外网访问)
        return_url: 'http://127.0.0.1:3000/alipay/return', // 支付宝处理完请求后,当前页面自动跳转到商户网站里指定页面的http路径。
        // 合作身份者ID,以2088开头由16位纯数字组成的字符串
        partner: '2088121387687137',
        // 交易安全检验码,由数字和字母组成的32位字符串
        key: 'gsgq7khai26i24rf6120ormr11kslulz',
        HTTPS_VERIFY_PATH: '/gateway.do?service=notify_verify&'
    },
    // 验证支付宝返回的参数
    alipayVerity = function(params, callback) {
        var mysign = getMySign(params);
        // mysign与sign不等,与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
        if (params.notify_id && (params.sign === mysign)) {
            var veryfy_path = payConf.HTTPS_VERIFY_PATH + 'partner=' + payConf.partner + '&notify_id=' + params.notify_id;
            requestUrl(payConf.ALIPAY_HOST, veryfy_path, function(responseTxt) {
                callback(responseTxt ? true : false);
            });
        } else {
            callback(false);
        }
    },
    // 根据对象参数,Key以支付宝规范生成验证码sign
    getMySign = function(params) {
        var key,
            arr = [];
        for (key in params) {
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
    // 自定义请求方法
    requestUrl = function(host, path, callback) {
        var https = require('https'),
            options = {
                host: host,
                port: 443,
                path: path,
                method: 'GET'
            };
        var req = https.request(options, res => {
            console.log('statusCode: ', res.statusCode, 'headers:', res.headers);
            // 这里需要判断statusCode的状态
            res.on('data', data => callback(data););
        });
        req.end();
        req.on('error', e => {
            console.error('请求出错', e);
            callback(false);
        });
    };

module.exports = {
    // 开始支付
    alipayto: function(req, res) {
        // 基本参数
        // service=create_direct_pay_by_user& //-接口名称-String-No
        // partner=***& //-合作者身份ID,以2088开头的16位纯数字组成-String(16)-No
        // _input_charset=utf-8& //-参数编码字符集,仅支持utf-8-String-No
        // sign_type=MD5& //-签名方式,DSA、RSA、MD5三个值可选,必须大写-String-No
        // sign=dfc1995af2ff01642a3cf6936ce0d57c& //-签名,请参见本文档'附录：签名与验签'-String-No
        // notify_url=***& //-服务器异步通知页面路径,支付宝服务器主动通知商户网站里指定的页面http路径-String(190)-Yes
        // return_url=***& //-页面跳转同步通知页面路径,支付宝处理完请求后,当前页面自动跳转到商户网站里指定页面的http路径-String(200)-Yes
        // 业务参数
        // out_trade_no=***& //-商户网站唯一订单号-String(64)-No
        // subject=11& //-商品名称-String(256)-No
        // total_fee=***& //-交易金额取值范围为[0.01,100000000.00],精确到小数点后两位-String-No
        // seller_id=*** //-卖家支付宝用户号,以2088开头的纯16位数字-String(16)-No
        // payment_type=1&  //-支付类型。仅支持：1（商品购买）-String(4)-No。
        // show_url=***& //-商品展示网址,收银台页面上,商品展示的超链接。-String(400)-No
        // body=***& //-商品描述-String(1000)-Yes
        // app_pay=Y& //-是否使用支付宝客户端支付,app_pay=Y：尝试唤起支付宝客户端进行支付,若用户未安装支付宝,则继续使用wap收银台进行支付。商户若为APP,则需在APP的webview中增加alipays协议处理逻辑。-String-Yes

        // 把请求参数打包成对象
        var sParaTemp = { // 基本参数
            service: ,
            partner: ,
            _input_charset: ,
            notify_url: ,
            return_url: ,
            partner: ,
            partner: ,
            partner: ,
            partner: ,
            partner: ,
            partner: ,
            partner: ,
            partner: ,
            partner:
        };
        sParaTemp.buyer_email = 'hangyangws@qq.com'; // 业务参数
        // 这个时候 sParaTemp 为一个包含所有参数的对象（无sign参数）

        // 加上sign sign_type
        _sParaTemp.sign = getMySign(_sParaTemp);
        _sParaTemp.sign_type = payConf.sign_type;

        // 向支付宝网关发出请求
        res.redirect(['https://',
            payConf.ALIPAY_HOST,
            '/',
            payConf.ALIPAY_PATH,
            '?',
            querystring.stringify(_sParaTemp)
        ]);
    },
    // 支付宝对商户的请求数据处理完成后,会将处理的结果数据通过系统程序控制客户端页面自动跳转的方式通知给商户网站。这些处理结果数据就是页面跳转同步通知参数。
    payreturn: function(req, res) {
        var params = req.query,
            trade_status = params.trade_status; // 交易状态

        alipayVerity(params, function(result) {
            if (result) {
                if (trade_status === 'TRADE_FINISHED' || trade_status === 'TRADE_SUCCESS') {
                    // 1、开通了普通即时到账,买家付款成功后。
                    // 2、开通了高级即时到账,从该笔交易成功时间算起,过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
                    // 该种交易状态只在一种情况下出现——开通了高级即时到账,买家付款成功后。
                }
                res.end('success');
            } else {
                res.end('fail');
            }
        });
    },
    // 支付宝异步通知
    paynotify: function(req, res) {
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
