$(document).ready(function() {
  let serverIp = prompt('Nhập vào địa chỉ ip máy chủ thu thập', '127.0.0.1');

  if (serverIp !== null && serverIp !== '127.0.0.1') {
    $.ajax({
      url: 'http://localhost:9999/updateServerIp',
      type: 'post',
      data: { serverIp },
      dataType: 'jsonp',
      complete: function() {
        location.href = 'http://localhost:9999/flot'
      }
    });
  }
});
