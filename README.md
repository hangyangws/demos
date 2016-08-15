# alipay_node
> 支付宝文档地址： (https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.0vF4aj&treeId=60&articleId=104790&docType=1#s5)[https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.0vF4aj&treeId=60&articleId=104790&docType=1#s5]

---

### 支付流程与简介

1. 构建支付参数
> 支付参数就是一个json对象或者javascript的对象。
> 比如`_input_charset`字符编码、`out_trade_no`商户网站唯一订单号、`return_url`支付完成后跳转的地址、`notify_url`支付完成后异步通知地址（一般用于业务逻辑记账）
> 其他详情参数见代码或者支付宝文档详情

1. 利用第一步骤生成的JSON参数，根据支付宝给定的方法，生成sign签名
> 代码示中，相应的生成sign的方法

1. 把第二步骤，生成的sign和sign_type加入第一步的JSON对象中

1. 最重要的一步来了，发起支付请求
> 构建支付URL，跳转网址
> 把前三个步骤得到的参数拼接到支付宝支付的地址后面，支付宝会根据参数内容自动发起支付界面

1. 支付宝支付完成
- 支付宝同步页面跳转（GET）
> 同步跳转页面的url地址就是在第一步骤我们已经设置好的return_url，**提示**: 如果需要自定义传递参数，可以在`return_url`后面拼接GET参数
- 支付宝异步页面回调（POST）
> 异步回调的url地址就是在第一步骤我们已经设置好的notify_url， **提示**: 回调地址是不能自定义参数的
- 说明
> 同步跳转`return_url`、异步回调 `notify_url` 不是必须参数，不传则支付宝也不会发起请求或者跳转。
