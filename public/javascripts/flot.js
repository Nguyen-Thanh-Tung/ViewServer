window.onload = function() {
  const fileInput = document.getElementById('fileInput');
  const fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change', function(e) {
    const file = fileInput.files[0];
    const textType = /text.*/;
    if (file.type.match(textType)) {
      const reader = new FileReader();
      reader.onload = function(e) {
        fileDisplayArea.innerText = reader.result;
      };
      reader.readAsText(file);
    } else {
      fileDisplayArea.innerText = "File not supported!"
    }
  });
};

$(function () {
  let count = 0;
  let countTemp = 0;
  let messages = '';
  /*
   * Real log
   */

  ws.onopen = function () {
    console.log('connected');
  };

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    for (let i = 0; i < data.length; i += 1) {
      count += 1;
      // messages += '<p>' + createLogString(data[i])+'</p>';
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
      max: 20000,
      show: true
    },
    xaxis: {
      show: true
    }
  });

  const updateInterval = 1000; //Fetch data ever x milliseconds
  let realtime = "on"; //If == to on then fetch data every x seconds. else stop fetching

  function update() {
    // $('#logInfor').text('');
    // $('#logInfor').append(messages);
    // $("#logInfor").animate({ scrollTop: $('#logInfor').prop("scrollHeight")}, updateInterval + 1000);
    messages = '';
    interactive_plot.setData([getEventPerSecond()]);
    // Since the axes don't change, we don't need to call plot.setupGrid()
    interactive_plot.draw();
    if (realtime === "on")
      setTimeout(update, updateInterval);
  }

  //INITIALIZE REALTIME DATA FETCHING
  if (realtime === "on") {
    update();
  }

  //REALTIME TOGGLE
  $("#realtime .btn").click(function () {
    if ($(this).data("toggle") === "on") {
      realtime = "on";
    }
    else {
      realtime = "off";
    }
    update();
  });
  /*
   * END INTERACTIVE CHART
   */


  /*
   * Bieu do cot
   * ---------
   */

  var bar_data = {
    data: [["Request", 12000], ["Response", 10000]],
    color: "#3c8dbc"
  };
  $.plot("#bar-chart", [bar_data], {
    grid: {
      borderWidth: 1,
      borderColor: "#f3f3f3",
      tickColor: "#f3f3f3"
    },
    series: {
      bars: {
        show: true,
        barWidth: 0.9,
        align: "center"
      }
    },
    xaxis: {
      mode: "categories",
      tickLength: 0
    }
  });
  /* END BAR CHART */

  /*
   * Bieu do tron
   * -----------
   */

  var donutData2 = [
    {label: "Error", data: 5, color: "#DF0029"},
    {label: "Access", data: 95, color: "#00A65A"}
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