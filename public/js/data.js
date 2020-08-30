import { updateChart } from "./updateChart.js"

let socket = io();

let humidityCanvas = document.getElementById('humidity-chart');
let temperatureCanvas = document.getElementById('temperature-chart');

let humidityCtx = humidityCanvas.getContext('2d');
let temperatureCtx = temperatureCanvas.getContext('2d');

socket.on("data", (data) => {
    console.log(data);
    updateChart(humidityCtx, "humidity", "%", data["humidity"], data["time"], 100);
    updateChart(temperatureCtx, "temperature", "°C", data["temperature"], data["time"], 50);
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
