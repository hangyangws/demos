const CACHE_NAME = 'cache-1',
  urlsToCache = [
    '/',
    'ico.ico',
    'index.html',
    'static/main.js',
    'static/index.js',
    'static/index.css',
    'static/img/error.jpg',
    'static/img/img1.JPG',
    'static/img/img2.jpg',
    'static/img/img3.jpg',
    'static/img/img4.jpg',
    'static/img/img5.jpg',
    'static/img/img6.jpg',
    'static/img/img7.jpg',
    'static/img/img8.jpg',
    'static/img/img9.jpg',
    'static/img/img10.jpg',
    'static/img/img11.jpg'
  ]

// 第一个响应事件：安装
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
    .open(CACHE_NAME) // 打开某个“缓存库”
    .then((cache) => {
      return cache.addAll(urlsToCache) // 向“缓存库”添加缓存文件
    })
  )
})

// 第二个响应事件：激活
// 一般在 activate 回调中进行缓存管理，原因在于：
// 如果在安装步骤中清除了任何旧缓存，那么控制所有当前页面的任何旧服务工作线程将突然无法从缓存中提供文件
self.addEventListener('activate', (event) => {
  var cacheWhitelist = ['cache-1'] // “缓存库”白名单

  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// 监听作用域下的 fetch 事件

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request) // 优先读取缓存
    .catch(function() { // 没有缓存，直接访问线上数据
      return fetch(event.request)
    })
    .then(function(response) {
      if (response) { // 有缓存，且缓存内容不为空，则使用缓存
        return response
      }
        // 缓存内容为空，继续发送请求
      return fetch(event.request)
        .then(function(response) {
            // 响应类型跨域
          if (response.type !== 'basic') {
            return response
          }
          // 检查并确保响应的状态为 200，确保
          if (!response || response.status !== 200) {
            return caches.match('/static/img/error.jpg')
          }

          // 正常响应
          var responseToCache = response.clone()
          caches
            .open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache)
            })

          return response
        })
        .catch(function() { // 线上数据访问不到：断网，或者路径出错
          return caches.match('/static/img/error.jpg')
        })
    })
    .catch(function() { // 线上数据访问不到：断网，或者路径出错
      return caches.match('/static/img/error.jpg')
    })
  )
})
