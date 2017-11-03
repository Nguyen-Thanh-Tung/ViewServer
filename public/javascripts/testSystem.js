$body = $("body");

$(document).ready(function() {
  let ipDelete = '';
  $('#buttonAdd, .btn.client').on('click', function() {
    if ($('#serverIp').text() === '0.0.0.0') {
      alert('Please update server before');
      return false;
    }
  });
  $('#addClient').on('click', () => {
    const ip = $('input[name="ip"]').val();
    const number = $('input[name="number"]').val();
    const numberValid = parseInt(number, 10);

    if (ip.trim() === '' || number.trim() === '') {
      alert('Hãy nhập đầy đủ các trường');
    } else if (isNaN(number) || numberValid <= 0) {
      alert('Number phải là số lớn hơn 0');
    } else {
      $.ajax({
        url: 'http://' + ip + ':2999/createServer/' + number + '/' + $('#serverIp').text(),
        type: 'get',
        data: {},
        dataType: 'jsonp',
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
      alert('Hãy nhập đầy đủ các trường');
    } else if (isNaN(number) || numberValid <= 0) {
      alert('Number phải là số lớn hơn 0');
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
      alert('Hãy nhập đầy đủ các trường');
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
    $('.clientIp').each(function(index) {
      const url = 'http://' + $(this).text() + ':2999/startServer';
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: {},
      });
    });
  });
});