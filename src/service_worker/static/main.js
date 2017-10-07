{
  window.addEventListener('load', winLoad)

  function winLoad() {
    registerServiceWorker()
    loadImg()
  }

  function registerServiceWorker() {
    // 检测浏览器是否支持 serviceWorker
    if ('serviceWorker' in navigator) {
      // 如果某个 service worker 已经被注册过，再次注册浏览器会自动忽略
      // 注册地址是相对于 origin，而不是相对于本 JS 文件
      console.log(`${appPath}service_worker.js`)
      navigator.serviceWorker.register(`${appPath}service_worker.js`, { scope: appPath })
        .then(function(registration) {
          // 注册成功
          console.log('success：')
          console.dir(registration)
        }).catch(function(err) {
          // 注册失败
          console.log('error：', err)
        })
    } else {
      console.log('浏览器不支持 service worker')
    }
  }

  // 用 XHR 加载图片
  function getImg(_img) {
    // 返回 Promise 对象
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest()
      request.open('GET', appPath + _img.url)
      request.responseType = 'blob'

      request.onload = function() {
        if (request.status === 200) {
          let responseImg = []
          responseImg[0] = request.response
          responseImg[1] = _img
          resolve(responseImg)
        } else {
          reject(Error('图片加载失败：' + request.statusText))
        }
      }

      request.onerror = function() {
        reject(Error('网络错误啦'))
      }

      request.send()
    })
  }

  // 创建图片DOM
  function getImgDom(img) {
    let $img = document.createElement('img')
    $img.src = window.URL.createObjectURL(img[0])
    $img.setAttribute('alt', img[1].title)

    let $figcaption = document.createElement('figcaption')
    $figcaption.innerHTML = img[1].title

    let $figure = document.createElement('figure')

    $figure.appendChild($img)
    $figure.appendChild($figcaption)

    let $li = document.createElement('li')
    $li.appendChild($figure)
    $li.className = 'img-list'

    return $li
  }

  function loadImg() {

    const _length = imgLists.length
    let $imgWrap = document.querySelector('.img-wrap'),
      $imgPlaceholder = document.querySelector('.img-placeholder'),
      _index = 0

    while (_index < _length) {
      getImg(imgLists[_index])
        .then(_img => {
          // 移除提示文字
          $imgPlaceholder && ($imgPlaceholder.remove(), $imgPlaceholder = false)

          // 加载图片
          let $img = getImgDom(_img)
          $imgWrap.appendChild($img)

          // 动画
          let _t = setTimeout(() => {
            clearTimeout(_t)
            $img.className = 'img-list img-list--active'
          }, 100)
        })
        .catch(_err => {
          console.log(_err)
        })

      _index++
    }
  }
}
