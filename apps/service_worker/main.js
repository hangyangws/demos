{
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // 注册（告诉浏览器你的 service worker 脚本在哪里）
      // 如果某个 service worker 已经被注册过，再次注册浏览器会自动忽略
      navigator.serviceWorker.register('/service_worker.js').then(function(registration) {
        // 注册成功
        console.log('success：')
        console.dir(registration)
      }).catch(function(err) {
        // 注册失败
        console.log('error：', err)
      })
    })
  }
}
