/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
  /*
   * Flot Interactive Chart
   * -----------------------
   */
  // We use an inline data source in the example, usually data would
  // be fetched from a server
  let data = [], totalPoints = 100;//Time

  function getRandomData() {
    if (data.length > 0)
      data = data.slice(1);
    // Do a random walk
    while (data.length < totalPoints) {
      const prev = data.length > 0 ? data[data.length - 1] : 500;
      let y = prev + Math.random() * 1000 - 500;
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

  const interactive_plot = $.plot("#interactive", [getRandomData()], {
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
    interactive_plot.setData([getRandomData()]);
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
   * LINE CHART
   * ----------
   */
  //LINE randomly generated data
  const sin = [], cos = [];

  for (let i = 0; i < 14; i += 0.5) {
    sin.push([i, Math.sin(i)]);
    cos.push([i, Math.cos(i)]);
  }
  const line_data1 = {
    data: sin,
    color: "#3c8dbc"
  };
  const line_data2 = {
    data: cos,
    color: "#00c0ef"
  };

  $.plot("#line-chart", [line_data1, line_data2], {
    grid: {
      hoverable: true,
      borderColor: "#f3f3f3",
      borderWidth: 1,
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
    },
    xaxis: {
      show: true
    }
  });

  //Initialize tooltip on hover
  $('<div class = "tooltip-inner" id="line-chart-tooltip"></div>').css({
    position: "absolute",
    display: "none",
    opacity: 0.8
  }).appendTo("body");

  $("#line-chart").bind("plothover", function (event, pos, item) {
    if (item) {
      const x = item.datapoint[0].toFixed(2),
        y = item.datapoint[1].toFixed(2);
      $("#line-chart-tooltip").html(item.series.label + " of " + x + " = " + y)
        .css({top: item.pageY + 5, left: item.pageX + 5})
        .fadeIn(200);
    } else {
      $("#line-chart-tooltip").hide();
    }
  });
  /* END LINE CHART */


  /*
   * FULL WIDTH STATIC AREA CHART
   * -----------------
   */
  const areaData = [[2, 88.0], [3, 93.3], [4, 102.0], [5, 108.5], [6, 115.7], [7, 115.6],
    [8, 124.6], [9, 130.3], [10, 134.3], [11, 141.4], [12, 146.5], [13, 151.7], [14, 159.9],
    [15, 165.4], [16, 167.8], [17, 168.7], [18, 169.5], [19, 168.0]];

  $.plot("#area-chart", [areaData], {
    grid: {
      borderWidth: 0
    },
    series: {
      shadowSize: 0, // Drawing is faster without shadows
      color: "#00c0ef"
    },
    lines: {
      fill: true //Converts the line chart to area chart
    },
    yaxis: {
      show: false
    },
    xaxis: {
      show: false
    }
  });
  /* END AREA CHART */


  /*
   * BAR CHART
   * ---------
   */
  const bar_data = {
    data: [["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9]],
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
        barWidth: 0.5,
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
   * DONUT CHART
   * -----------
   */
  const donutData = [
    {label: "Series2", data: 30, color: "#3c8dbc"},
    {label: "Series3", data: 20, color: "#0073b7"},
    {label: "Series4", data: 50, color: "#00c0ef"}
  ];
  $.plot("#donut-chart", donutData, {
    series: {
      pie: {
        show: true,
        radius: 1,
        innerRadius: 0.5,
        label: {
          show: true,
          radius: 2 / 3,
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
   * END DONUT CHART
   */
});

$(function () {
  $('#logInfor').append('fuck you');
  /*
   * Real log
   */
  const ws = new WebSocket('ws://localhost:8000/view');

  ws.onopen = function () {
    console.log('connected');
  };

  ws.onmessage = function (event) {
    const data = event.data;
    data.forEach((log) => {
      $('#logInfor').append(log);
    });

    console.log(event.data);
  };

  /*
   * End real log
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

/***/ })
/******/ ]);