$(document).ready(function() {
  const hasData = $('body').attr('data-has-data');
  if (hasData === '0') {
    toastr.warning('There is no statistical data', { timeOut: 5000 });
  }
  const serverId = $('body').attr('data-server-id');
  $('#sel1 option').each(function(index) {
    if ($(this).attr('data-server-id') === serverId) {
      $(this).addClass('active');
    }
  });

  $('#sel1 option').on('click', function() {
    const serverId = $(this).attr('data-server-id');
    location.href = 'http://localhost:9999/flot?serverId=' + serverId;
  });
});

$(function () {
  let count = 0;
  let countTemp = 0;
  let messages = '';
  const serverId = $('body').attr('data-server-id');
  const serverName = serverId === '0' ? '0' : $('option.active').text();
  /*
   * Real log
   */

  ws.onopen = function () {
    console.log('connected');
  };

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const tempData = data.filter(function(item) {
      return item.serverName == serverName;
    });
    count += tempData.length;
    for (let i = 0; i < tempData.length; i += 1) {
      messages += '<p>' + createLogString(data[i])+'</p>';
      // $('#logInfor').append('<p>' + createLogString(data[i])+'</p>');
      // $('#logInfor').scrollTop = $('#logInfor').scrollHeight;
      // $("#logInfor").animate({ scrollTop: $('#logInfor').prop("scrollHeight")}, 100);
    }
  };

  /*
   * End real log
   */

  /*
   * Flot Interactive Chart
   * -----------------------
   */
  // We use an inline data source in the example, usually data would
  // be fetched from a server
  let data = [], totalPoints = 100;//Time

  function getEventPerSecond() {
    if (data.length > 0)
      data = data.slice(1);
    // Do a random walk
    while (data.length < totalPoints) {
      // const prev = 11500;
      // let y = prev + Math.random() * 1000;
      let y = count;
      $('#eps').text(y);
      // console.log(count + ':' + countTemp + ':' + y);
      count = 0;
      // countTemp = count;
      if (y < 0) {
        y = 0;
      } else if (y > 20000) {
        y = 20000;
      }
      data.push(y);
    }

    // Zip the generated y values with the x values
    const res = [];
    for (let i = 0; i < data.length; ++i) {
      res.push([i, data[i]]);
    }
    return res;
  }

  const interactive_plot = $.plot("#interactive", [getEventPerSecond()], {
    grid: {
      borderColor: "#f3f3f3",
      borderWidth: 1,
      tickColor: "#f3f3f3"
    },
    series: {
      shadowSize: 0, // Drawing is faster without shadows
      color: "#3c8dbc"
    },
    lines: {
      fill: true, //Converts the line chart to area chart
      color: "#3c8dbc"
    },
    yaxis: {
      min: 0,
      max: serverName === '0' ? 20000 : 60,
      show: true
    },
    xaxis: {
      show: true,
    }
  });

  const updateInterval = 1000; //Fetch data ever x milliseconds
  const updateInterval2 = 1000; //Fetch data ever x milliseconds
  let start = "off";

  function update() {
    interactive_plot.setData([getEventPerSecond()]);
    // Since the axes don't change, we don't need to call plot.setupGrid()
    interactive_plot.draw();
    setTimeout(update, updateInterval);
  }

  function update2() {
    $('#logInfor').append(messages);
    $("#logInfor").animate({ scrollTop: $('#logInfor').prop("scrollHeight")}, updateInterval2 + 500);
    messages = '';
    if (start === "on")
      setTimeout(update2, updateInterval2);
  }

  //INITIALIZE REALTIME DATA FETCHING
  update();
  if (start === "on") {
    update2();
  }

  $("#stop .btn").click(function () {
    if ($(this).data("toggle") === "on") {
      start = "on";
    }
    else {
      start = "off";
    }
    update2();
  });
  /*
   * END INTERACTIVE CHART
   */


  /*
   * Bieu do cot
   * ---------
   */

  // var bar_data = {
  //   data: [["Request", 12000], ["Response", 10000]],
  //   color: "#3c8dbc"
  // };
  // $.plot("#bar-chart", [bar_data], {
  //   grid: {
  //     borderWidth: 1,
  //     borderColor: "#f3f3f3",
  //     tickColor: "#f3f3f3"
  //   },
  //   series: {
  //     bars: {
  //       show: true,
  //       barWidth: 0.9,
  //       align: "center"
  //     }
  //   },
  //   xaxis: {
  //     mode: "categories",
  //     tickLength: 0
  //   }
  // });
  /* END BAR CHART */


  /*
   * Bieu do tron
   * -----------
   */
  var error = parseFloat($('#donut-chart2').attr('data-rate-error'));
  var access = 100 - error;
  var donutData2 = [
    {label: "Error", data: error, color: "#DF0029"},
    {label: "Access", data: access, color: "#00A65A"}
  ];
  $.plot("#donut-chart2", donutData2, {
    series: {
      pie: {
        show: true,
        radius: 1,
        innerRadius: 0,
        label: {
          show: true,
          radius: 1 / 2,
          formatter: labelFormatter,
          threshold: 0.1
        }

      }
    },
    legend: {
      show: false
    }
  });
  /*
   * END DONUT CHART2
   * Thay doi co chu trong bieu do tron trong ham labelFormatter
   */


  /*
   * LINE CHART
   * ----------
   */
  //LINE randomly generated data

  var responseTime = JSON.parse($('#line-chart').attr('data-response-time'));
  // for (var i = 10; i > 0; i -= 1) {
  //   responseTime.push([i, 43 + Math.random()* 2]);
  // }
  var line_data = {
    data: responseTime,
    color: "#3c8dbc"
  };
  $.plot("#line-chart", [line_data], {
    grid: {
      hoverable: true,
      borderColor: "#f3f3f3",
      borderWidth: 0.1,
      tickColor: "#f3f3f3"
    },
    series: {
      shadowSize: 0,
      lines: {
        show: true
      },
      points: {
        show: true
      }
    },
    lines: {
      fill: false,
      color: ["#3c8dbc", "#f56954"]
    },
    yaxis: {
      show: true,
      min: 0,
      max: 200,
    },
    xaxis: {
      show: true
    }
  });
  //Initialize tooltip on hover
  $('<div class="tooltip-inner" id="line-chart-tooltip"></div>').css({
    position: "absolute",
    display: "none",
    opacity: 0.8
  }).appendTo("body");
  $("#line-chart").bind("plothover", function (event, pos, item) {

    if (item) {
      var x = item.datapoint[0].toFixed(2),
        y = item.datapoint[1].toFixed(2);

      $("#line-chart-tooltip").html('response time' + " of " + x + " = " + y)
        .css({top: item.pageY + 5, left: item.pageX + 5})
        .fadeIn(200);
    } else {
      $("#line-chart-tooltip").hide();
    }

  });
  /* END LINE CHART */
});

/*
 * Custom Label formatter
 * ----------------------
 */
function labelFormatter(label, series) {
  return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
    + label
    + "<br/>"
    + Math.round(series.percent) + "%</div>";
}

/*
 * Create log string
 */
function createLogString(log) {
  const {
    serverName, serverIp, method, status, path, responseTime, contentLength,
  } = log;

  return `<span style="color: red; font-weight: bold;">${serverName}</span> <span>${serverIp}</span> <span>${method}</span> <span>${path}</span> <span style="color: yellow">${status}</span> <span>${responseTime} ms</span> - <span>${contentLength}</span>`;
}