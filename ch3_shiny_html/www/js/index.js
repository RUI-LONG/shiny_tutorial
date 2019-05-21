var app = angular.module('app', []);

app.controller('dataCtrl', function($scope) {
  
  $scope.piedata = [5, 10, 20, 45, 6];
  $scope.updatePieData = function() {
    $scope.piedata = [];
    var numDataPoints = 5;
    var range = Math.random() * 10;
    for (var i = 0; i < numDataPoints; i++) {
      var newNumber = Math.floor(Math.random() * range);
      if (newNumber == 0) {
        $scope.piedata.push(1);
      } else {
        $scope.piedata.push(newNumber);
      }

    }
  };

  $scope.bardata = [5, 8, 10, 2, 4, 2, 9];

  $scope.updateBarData = function() {
    $scope.bardata = [];
    var numDataPoints = 7;
    var range = Math.random() * 10;
    for (var i = 0; i < numDataPoints; i++) {
      var newNumber = Math.floor(Math.random() * range);
      $scope.bardata.push(newNumber);
    }
  };

  $scope.scatterdata = [
    [83, 104],
    [15, 200],
    [92, 100],
    [55, 55],
    [20, 143]
  ];

  $scope.updateScatterData = function() {
    $scope.scatterdata = [];
    var numDataPoints = 20;
    var xRange = Math.random() * 120;
    var yRange = Math.random() * 250;
    for (var i = 0; i < numDataPoints; i++) {
      var newNumber1 = Math.floor(Math.random() * xRange);
      var newNumber2 = Math.floor(Math.random() * yRange);
      $scope.scatterdata.push([newNumber1, newNumber2]);
    }
  }
});

app.directive('scatterPlot', function($window) {
  return {
    restrict: 'E',
    scope: {
      scatterdata: '='
    },
    link: function(scope, element, array) {

      var data = scope.scatterdata;
      var el = element[0];
      var w = 400;
      var h = 400;
      var padding = 40;

      //Create scale functions
      var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[0];
        })])
        .range([padding, w - padding * 2]);

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[1];
        })])
        .range([h - padding, padding]);

      var rScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[1];
        })])
        .range([4, 14]);

      // Create axes
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5);

      //Create SVG element
      var svg = d3.select(el)
        .append("svg")
        .attr('id', 'scatter-plot')
        .attr("width", w)
        .attr("height", h)
        .attr('viewBox', '0 0 400 400')
        .attr('preserveAspectRatio', 'xMinYMin');

      svg.append("g") // create new g
        .attr('id', 'circles') // assign id of "circles"
        .attr('clip-path', 'url(#chart-area)') // add reference to clipPath
        .selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return xScale(d[0]);
        })
        .attr("cy", function(d) {
          return yScale(d[1]);
        })
        .attr("r", function(d) {
          return rScale(d[1]);
        });

      svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(0,' + (h - padding) + ')') // sends axis to bottom
					.call(xAxis);
	
			svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(' + padding + ',0)')
					.call(yAxis);

      svg.append('clipPath')
        .attr('id', 'chart-area')
        .append('rect')
        .attr('x', padding)
        .attr('y', padding)
        .attr('width', w - padding * 3)
        .attr('height', h - padding * 2);

      /* ------ Render Specs ----- */
      scope.render = function(newData, oldData) {
        var data = newData || data;

        svg.selectAll("circle")
          .data(data)
          .transition()
          .duration(400) // milliseconds, so 1 second duration
          .each('start', function() {
            d3.select(this)
              .attr('fill', '#EA5A5A')
          })
          .attr("cx", function(d) {
            return xScale(d[0]);
          })
          .attr("cy", function(d) {
            return yScale(d[1]);
          })
          .attr("r", function(d) {
            return rScale(d[1]);
          })
          .each('end', function() {
            d3.select(this)
              .attr('fill', '#28BD8B')
          });
        
        svg.append("g") // create new g
        .attr('id', 'circles') // assign id of "circles"
        .attr('clip-path', 'url(#chart-area)') // add reference to clipPath
   

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding) + ')') // sends axis to bottom
        .call(xAxis);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ',0)')
        .call(yAxis);

      };
      
      

      function updateWindow() {
        var scatter = d3.select('#scatter-plot');
        scatter.attr("width", '100%');
        scatter.attr("height", '100%');
      }

      angular.element($window).bind('resize', function() {
        updateWindow();
      })
      
      scope.$watch('scatterdata', function(newData, oldData) {
        console.log('watch fired');
        scope.render(newData, oldData);
      }, true);

    }
  };
});

app.directive('pieChart', function($window) {
  return {
    restrict: 'E',
    scope: {
      piedata: '='
    },
    link: function(scope, element, attrs) {

      var data = scope.piedata;
      var el = element[0];
      var w = 400;
      var h = 400;
      var color = d3.scale.ordinal()
        .domain(d3.range(5))
        .range(["#1e5684", "#0D704F", "#8CC8F0", "#3484B7", "#28BD8B"]);

      
      

      var pie = d3.layout.pie();

      var outerRadius = w / 2;
      var innerRadius = w / 4; // 0 for pie chart,  > 0 foro donut chart
      var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      var svg = d3.select(el)
        .append('svg')
        .attr('id', 'pie-chart')
        .attr('width', w)
        .attr('height', h)
        .attr('viewBox', '0 0 400 400')
        .attr('preserveAspectRatio', 'xMinYMin');

      var arcs = svg.selectAll('g.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

      arcs.append('path')
        .attr('fill', function(d, i) {
          return color(i);
        })
        .attr('d', arc);

      arcs.append('text')
        .attr('transform', function(d) {
          return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('text-anchor', 'middle')
        .text(function(d) {
          return d.value;
        })
        .attr('fill', 'white')

      scope.render = function(data) {


        svg.selectAll('.arc')
          .data(pie(data))
          .transition()
          .attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')')

        svg.selectAll('path')
          .data(pie(data))
          .transition()
          .attr('fill', function(d, i) {
            return color(i);
          })
          .attr('d', arc);

        svg.selectAll('.arc > text')
          .data(pie(data))
          .transition()
          .attr('transform', function(d) {
            return 'translate(' + arc.centroid(d) + ')';
          })
          .text(function(d) {
            return d.value;
          })

      };
      

      function updateWindow() {
        var pie = d3.select('#pie-chart');
        pie.attr("width", '100%');
        pie.attr("height", '100%');
      }

      angular.element($window).bind('resize', function() {
        updateWindow();
      })

      scope.$watch('piedata', function(data) {
        scope.render(data);
      });

    }
  };
});

app.directive('barChart', function($window) {
  return {
    restrict: 'E',
    scope: {
      bardata: '='
    },
    link: function(scope, element, attr) {

      var data = scope.bardata;
      var w = 400;
      var h = 400;
      var el = element[0];
      var svg = d3.select(el)
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('id', 'bar-chart')
        .attr('viewBox', '0 0 400 400')
        .attr('preserveAspectRatio', 'xMinYMin');

      var xScale = d3.scale.ordinal()
        .domain(d3.range(data.length)) // sets domain for length of our array
        .rangeRoundBands([0, w], 0.05); // 5% space between each band

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, h]);

      var rect = svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
          return xScale(i);
        })
        .attr('y', function(d) {
          return h - yScale(d);
        })
        .attr('width', xScale.rangeBand())
        .attr('height', function(d) {
          return yScale(d);
        })
        .attr('fill', function(d) {
          return "rgb(0," + (d * 10) + ",0)";
        });

      var text = svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(function(d) {
          return d;
        })
        .attr('x', function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr('y', function(d) {
          return h - yScale(d) + 30;
        })
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px');

      scope.render = function(newData, oldData) {

        var data = newData || data;

        var xScale = d3.scale.ordinal()
          .domain(d3.range(data.length)) // sets domain for length of our array
          .rangeRoundBands([0, w], 0.05); // 5% space between each band

        var yScale = d3.scale.linear()
          .domain([0, d3.max(data)])
          .range([0, h]);

        /* ------  CHANGE HEIGHT ON NEW VALUES ------ */
        svg.selectAll('rect')
          .data(data)
          .transition()
          .delay(function(d, i) {
            return i * 10;
          })
          .duration(400) // milliseconds, so 1 second duration
          .attr('y', function(d) {
            return h - yScale(d);
          })
          .attr('height', function(d) {
            return yScale(d);
          })
          .attr('fill', function(d) {
            /* rgb(53,202,152) */
            return "rgba(53,202,152," + (yScale(d)) * 0.002 + ")";
          });

        /* ------  CHANGE TEXT ON NEW VALUES ------ */
        svg.selectAll('text')
          .data(data)
          .transition()
          .delay(function(d, i) {
            return i * 10;
          })
          .duration(400)
          .text(function(d) {
            return d;
          })
          .attr('x', function(d, i) {
            return xScale(i) + xScale.rangeBand() / 2;
          })
          .attr('y', function(d) {
            return h - yScale(d) + 30;
          });
      };
      
      function updateWindow() {
        var bar = d3.select('#bar-chart')
        bar.attr("width", '100%');
        bar.attr("height", '100%');
      }

      angular.element($window).bind('resize', function() {
        updateWindow();
      })

      scope.$watch('bardata', function(bardata, oldData) {
        console.log('watch fired');
        scope.render(bardata, oldData);
      }, true);

    }
  };
});