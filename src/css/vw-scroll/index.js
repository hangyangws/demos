'use strict'

;
(function(win, undefined) {
  var $content = document.getElementById('content')
  var itemCount = 1
  var allCount = 20
  var time

  function getHtml() {
    var $li = document.createElement('li')

    $li.appendChild(document.createTextNode(`动态加载内容 ${itemCount++}`))
    $li.className = 'item'

    return $li
  }

  function fillContent() {
    time = setInterval(() => {
      if (itemCount <= allCount) {
        $content.appendChild(getHtml())
      } else {
        clearInterval(time)
      }
    }, 400)
  }

  fillContent()
}(window, document));