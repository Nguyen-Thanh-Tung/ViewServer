$body = $("body");

$(document).ready(function() {
  let ipDelete = '';
  $('#buttonAdd, .btn.client').on('click', function() {
    if ($('#serverIp').text() === '0.0.0.0') {
      toastr.error('Please update server before', { timeOut: 5000 });
      return false;
    }
  });
  $('#addClient').on('click', () => {
    const ip = $('input[name="ip"]').val();
    const number = $('input[name="number"]').val();
    const numberValid = parseInt(number, 10);

    if (ip.trim() === '' || number.trim() === '') {
      toastr.error('Input required', {timeOut: 5000});
    } else if (isNaN(number) || numberValid <= 0) {
      toastr.error('Number is greater than 0', { timeOut: 5000 });
    } else {
      $.ajax({
        url: 'http://' + ip + ':2999/createServer/' + number + '/' + $('#serverIp').text(),
        type: 'get',
        data: {},
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        beforeSend: function() {
          $('#add-client-modal').modal('toggle');
          $body.addClass("loading");
        },
        complete: function() {
          // $('#add-client-modal').modal('toggle');
          $body.removeClass("loading");
          location.reload();
        }
      });
    }
  });

  $('#editClient').on('click', () => {
    const ip = $('input[name="newIp"]').val();
    const number = $('input[name="newNumber"]').val();
    const numberValid = parseInt(number, 10);

    if (ip.trim() === '' || number.trim() === '') {
      toastr.error('Input required', {timeOut: 5000});
    } else if (isNaN(number) || numberValid <= 0) {
      toastr.error('Number is greater than 0', {timeOut: 5000});
    } else {
      $.ajax({
        url: 'http://' + ip + ':2999/createServer/' + number + '/' + $('#serverIp').text(),
        type: 'get',
        data: {},
        dataType: 'jsonp',
        beforeSend: function() {
          $('#edit').modal('toggle');
          $body.addClass("loading");
        },
        complete: function() {
          // $('#edit').modal('toggle');
          $body.removeClass('loading');
          location.reload();
        }
      });
    }
  });
  $('#editS').on('click', function() {
    const ip = $('input[name="newIpServer"]').val();

    if (ip.trim() === '') {
      toastr.error('Input required', { timeOut: 5000 });
    } else {
      $.ajax({
        url: 'http://localhost:9999/updateServerIp',
        type: 'post',
        dataType: 'jsonp',
        data: { serverIp: ip},
        beforeSend: function() {
          $('#editServer').modal('toggle');
          $body.addClass("loading");
        },
        complete: function() {
          $body.removeClass("loading");
          location.reload();
        }
      });
    }
  });
  $(".btn.btn-danger").on("click", function() {
    ipDelete = $(this).attr('data-ip');
  });

  $('#deleteClient').on('click', () => {
    $.ajax({
      url: 'http://localhost:9999/deleteClient',
      type: 'post',
      dataType: 'jsonp',
      data: { clientIp: ipDelete},
      beforeSend: function() {
        $('#delete').modal('toggle');
        $body.addClass("loading");
      },
      complete: function() {
        $body.removeClass("loading");
        location.reload();
      }
    });
  });

  $('#startServer').on('click', function() {
    let path = '';
    if ($(this).attr('data-isStart') === '0') {
      path = '/startServer';
      $(this).attr('data-isStart', '1');
      $(this).text('Stop Server');
    } else {
      path = '/closeServer';
      $(this).attr('data-isStart', '0');
      $(this).text('Start Server');
      $('#sendRequest').attr('data-sending', '0');
      $('#sendRequest').text('Send Request');
    }
    $('.clientIp').each(function(index) {
      const url = 'http://' + $(this).text() + ':2999' + path;
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        data: {},
        success: function(data) {
          if (data.status === 200) {
            toastr.success('Started Server', { timeOut: 5000 });
          } else {
            toastr.error(data.message, { timeOut: 5000 });
          }
        }
      });
    });
  });
});