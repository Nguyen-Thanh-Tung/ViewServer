$(document).ready(function() {
  let serverIp = prompt('Nhập vào địa chỉ ip máy chủ thu thập', '127.0.0.1');

  if (serverIp !== null) {
    $.ajax({
      url: 'http://localhost:9999/updateServerIp',
      type: 'post',
      data: { serverIp },
      dataType: 'jsonp',
      jsonpCallback: 'callback',
      success: function(data) {
        if (data.status === 200) {
          location.href = 'http://localhost:9999/flot'
        } else {
          alert('Cant connect to database');
        }
      }
    });
  }
});
