import { updateChart } from "./updateChart.js"

let socket = io();

let dateInput = document.getElementById('datepicker');

let humidityCanvas = document.getElementById('humidity-chart');
let temperatureCanvas = document.getElementById('temperature-chart');

let humidityCtx = humidityCanvas.getContext('2d');
let temperatureCtx = temperatureCanvas.getContext('2d');

socket.on("data", (response) => {
    if (response == "empty") {
      console.log("empty")
    } else {
      if (response.date == dateInput.value) {
        humidityCtx.clearRect(0, 0, humidityCanvas.width, humidityCanvas.height);
        temperatureCtx.clearRect(0, 0, temperatureCanvas.width, temperatureCanvas.height);
        updateChart(humidityCtx, "humidity", "%", response.data.humidity, response.data.time, 100);
        updateChart(temperatureCtx, "temperature", "°C", response.data.temperature, response.data.time, 50);
      }
    }
});

$("#datepicker").datepicker({
    weekStart: 1,
    daysOfWeekHighlighted: "6.0",
    autoclose: true,
    todayHighlight: true,
  }).on("changeDate", ()=>{
    socket.emit("date", $("#datepicker").val());
  });
$("#datepicker").datepicker("setDate", new Date());
