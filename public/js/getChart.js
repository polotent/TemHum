export function getChart (ctx, dataLabel, suffix, data, time, maxValue) {
  return new Chart(ctx, {
    type: 'line',
    data: {
        labels: time,
        datasets: [{
            borderColor: 'rgb(34, 124, 46)',
            backgroundColor: 'transparent',
            data: data,
        }]
    },
    options: {
      scales : {
        yAxes: [{
          ticks : {
            fontSize : 16,
            beginAtZero : true,
            max : maxValue,
            stepSize : 10,
            callback: function(value, index, values){
              return value + suffix;
            }
          },
          scaleLabel : {
            fontSize : 16,
            display : true,
            labelString : dataLabel
          }
        }],
        xAxes: [{
          ticks : {
            fontSize : 16
          },
          scaleLabel: {
            fontSize : 16,
            display : true,
            labelString : 'time'
          }
        }]
      },
      legend : false,
      animation : false
    }
  });
};