let CACHE_NAME = 'my-site-cache-v1',
  urlsToCache = [
    '/',
    '/styles/main.css',
    '/script/main.js'
  ]

// 安装回调
self.addEventListener('install', function(event) {
  // 打开缓存
  // 缓存文件
  // 确认所有需要的资产是否缓存
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      console.log(`缓存 ${CACHE_NAME} 已经开启`)
      return cache.addAll(urlsToCache)
    })
  )
})

// 监听当前目录权限下的 fetch 事件
// 如果有缓存则使用缓存，没有缓存则发出请求
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches
//     .match(event.request)
//     .then(function(response) {
//       if (response) {
//         return response
//       }
//       return fetch(event.request)
//     })
//   )
// })

// 监听当前目录权限下的 fetch 事件
// 如果有缓存则使用缓存，没有缓存则发出请求
// 获得请求 response 后，确保响应有效
// 检查并确保响应的状态为 200
// 确保响应类型为 basic，亦即由自身发起的请求。 这意味着，对第三方资产的请求不会添加到缓存（跨域不缓存）
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
    .match(event.request)
    .then(function(response) {
      if (response) {
        return response
      }

      var fetchRequest = event.request.clone()

      return fetch(fetchRequest).then(
        function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          var responseToCache = response.clone()

          caches
            .open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache)
            })

          return response
        }
      )
    })
  )
})

// 一般在 activate 回调中进行缓存管理，原因在于：
// 如果在安装步骤中清除了任何旧缓存，那么控制所有当前页面的任何旧服务工作线程将突然无法从缓存中提供文件

// 监听激活事件
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1']

  event.waitUntil(
    // caches.keys() 返回promise对象，数据为旧版的 catch 名称数组
    caches.keys().then(function(cacheNames) {
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
