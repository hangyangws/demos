;
! function(win, $, undefined) {
  'use strict'

  /**
   * 基本变量
   */

  var maxSize = 1024 * 1024 * 3 // 3M
  var fileReg = /^image\/(bmp|gif|jpeg|png|tiff)$/i
  var background = 'url(${src}) 50% 50% / cover'
  var imgTag = '<img class="j-report-img report-img" src="${src}">'

  /**
   * DOM 缓存
   */

  var $showResult = $('#showResult')
  var $showEdit = $('#showEdit')
  var $logo = $showResult.find('.j-logo')
  var $report = $('#report')

  /**
   * 功能函数
   */

  var cutImage = function() {
    $showResult.hide()
    $showEdit.fadeIn()
    $report.find('.j-report-img').cropper({
      aspectRatio: 1 / 1,
      viewMode: 1,
      dragMode: 'move',
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      minContainerHeight: 400,
      minContainerWidth: 300
    })
  }
  var isFile = function(type) {
    return fileReg.test(type)
  }
  var logoPreview = function(src) {
    if (src) {
      $logo.data('img', src)
    }

    $logo.css({
      background: background.replace('${src}', $logo.data('img'))
    })
  }
  var setCutImg = function(src) {
    $report.html(imgTag.replace('${src}', src))
  }

  /**
   * 事件函数
   */

  var handlers = {
    fileSelected: function() {
      var file = this.files[0] // 文件
      var fileReader = new FileReader()
      var image = new Image()
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var imgOrientation = null

      // 取消 onChange 的第二次缓存问题
      this.value = ''

      if (!isFile(file.type)) {
        alert('文件格式必须为图片')
        return
      }

      // 用 EXIF 库获取照片方向属性
      win.EXIF.getData(file, function() {
        imgOrientation = EXIF.getTag(this, 'Orientation')
      })

      fileReader.onload = function() {
        image.src = fileReader.result
      }

      image.onload = function() {
        var imgWidth = image.naturalWidth
        var imgHeight = image.naturalHeight
        var sizeRatio = Math.sqrt(file.size / maxSize)
        var quality = maxSize > file.size ? 0.8 : 0.5
        var imgDataBase64 = null

        if (sizeRatio < 1) {
          sizeRatio = 1
        }

        var canvasWidth = imgWidth / sizeRatio
        var canvasHeight = imgHeight / sizeRatio

        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // 填充画布背景为白色，因为 png 的透明区域默认被 canvas 处理为黑色
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, canvasWidth, canvasHeight)

        // 判断是否需要旋转
        if (imgOrientation !== "" && imgOrientation !== 1 && imgOrientation !== undefined) {
          switch (imgOrientation) {
            case 6: // 需要顺时针 90 度旋转
              canvas.width = canvasHeight
              canvas.height = canvasWidth
              ctx.rotate(90 * Math.PI / 180)
              ctx.drawImage(this, 0, -canvasHeight)
              break
            case 8: // 需要逆时针 90 度旋转
              canvas.width = canvasHeight
              canvas.height = canvasWidth
              ctx.rotate(-90 * Math.PI / 180)
              ctx.drawImage(this, -canvasWidth, 0)
              break
            case 3: // 需要 180 度旋转
              ctx.rotate(180 * Math.PI / 180)
              ctx.drawImage(this, -widcanvasWidthth, -canvasHeight)
              break
          }
        }

        imgDataBase64 = canvas.toDataURL('image/jpeg', quality)

        setCutImg(imgDataBase64)
        cutImage()
      }

      fileReader.readAsDataURL(file)
    },
    cancelFile: function() {
      $showEdit.hide()
      $showResult.fadeIn()
    },
    confirmFile: function() {
      var dataURL = $report.find('.j-report-img').cropper('getCroppedCanvas')
      var imgUrl = dataURL.toDataURL('image/jpeg', 0.5)

      logoPreview(imgUrl)
      $showEdit.hide()
      $showResult.fadeIn()
    }
  }

  /**
   * 事件绑定
   */
  logoPreview()

  $showResult
    .on('change', '.j-logo-file', handlers.fileSelected) // 触发图片上传

  $showEdit // 图片的取消与确认
    .on('click', '.j-cancel', handlers.cancelFile)
    .on('click', '.j-confirm', handlers.confirmFile)
}(window || this, jQuery);