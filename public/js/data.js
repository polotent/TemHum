import { getChart } from "./getChart.js"

let socket = io();

let serverStatus = document.getElementById("server-status");

let dateInput = document.getElementById("datepicker");

let humidityChartContainer = document.getElementById("humidity-chart-container");
let temperatureChartContainer = document.getElementById("temperature-chart-container");

let humidityChart, temperatureChart;

socket.on("connect", () => {
  serverStatus.innerHTML = "connected";
});

socket.on("reconnect", () => { 
  serverStatus.innerHTML = "connected";
  socket.emit("date", $("#datepicker").val());
});

socket.on("disconnect", () => {
  serverStatus.innerHTML = "disconnected";
});  

socket.on("data", (response) => {
  humidityChartContainer.innerHTML = '&nbsp;';
  humidityChartContainer.innerHTML = '<canvas id="humidity-chart"></canvas>';

  temperatureChartContainer.innerHTML = '&nbsp;';
  temperatureChartContainer.innerHTML = '<canvas id="temperature-chart"></canvas>';

  let humidityCanvas = document.getElementById('humidity-chart');
  let temperatureCanvas = document.getElementById('temperature-chart');
  
  let humidityCtx = humidityCanvas.getContext('2d');
  let temperatureCtx = temperatureCanvas.getContext('2d');

  if ((response != "empty") && (response.date == dateInput.value)) {
    humidityChart = getChart(humidityCtx, "humidity", "%", response.data.humidity, response.data.time, 100);
    temperatureChart = getChart(temperatureCtx, "temperature", "°C", response.data.temperature, response.data.time, 50)
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
