function print() {
  var table = $("#table1"),
    tableWidth = table.outerWidth(),
    pageWidth = 600,
    pageCount = Math.ceil(tableWidth / pageWidth),
    printWrap = $("<div></div>").insertAfter(table),
    i,
    printPage

  for (i = 0 i < pageCount i++) {
    printPage = $("<div></div>").css({
      "overflow": "hidden",
      "width": pageWidth,
      "page-break-before": i === 0 ? "auto" : "always"
    }).appendTo(printWrap)
    table.clone().removeAttr("id").appendTo(printPage).css({
      "position": "relative",
      "left": -i * pageWidth
    })
  }
}

const getStyle = (() => {
  if (window.getComputedStyle) {
    return (element, attr) => window.getComputedStyle(element, null)[attr]
  }

  if (element.currentStyle) {
    return (element, attr) => element.currentStyle[attr]
  }

  return (element, attr) => element.style[attr]
})()

const getDom = dom => document.querySelector(dom)

handlePrint () => {
  const bodyWidth = getStyle(getDom('body'), 'width')
  const $ads = getDom('.OrderPage-ads')
  const tableWidth = getStyle($ads, 'width')
  const pageCount = Math.ceil(tableWidth / bodyWidth)

  Array(pageCount).fill(null).map(() => (
    <div
      className='OrderPage-adsPrintWrap'
      style={{
        width: bodyWidth,
        'page-break-before': index++ === 0 ? 'auto' : 'always'
      }}
    >
      {$ads.cloneNode(true)}
    </div>
  ))
}
