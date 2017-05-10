onmessage = function(e) {
  var _data = e.data
  postMessage(`${_data.join(' x ')} = ${_data[0] * _data[1]}`)
