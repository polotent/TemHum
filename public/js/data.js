import { getChart } from "./getChart.js"

let socket = io();

let serverStatus = document.getElementById("server-status");
let serverStatusIconConnected = document.getElementById("server-status-connected");
let serverStatusIconDisconnected = document.getElementById("server-status-disconnected");

let dateInput = document.getElementById("datepicker");

let infoMessage = document.getElementById("info-message");

let humidityCanvas = document.getElementById('humidity-chart');
let temperatureCanvas = document.getElementById('temperature-chart');

let humidityChartContainer = document.getElementById("humidity-chart-container");
let temperatureChartContainer = document.getElementById("temperature-chart-container");

let humidityChart, temperatureChart;

socket.on("connect", () => {
  serverStatus.innerHTML = "connected";
  serverStatusIconDisconnected.style.display = "none";
  serverStatusIconConnected.style.display = "inline-block";
});

socket.on("reconnect", () => { 
  serverStatus.innerHTML = "connected";
  serverStatusIconDisconnected.style.display = "none";
  serverStatusIconConnected.style.display = "inline-block";
  socket.emit("date", $("#datepicker").val());
});

socket.on("disconnect", () => {
  serverStatus.innerHTML = "disconnected";
  serverStatusIconConnected.style.display = "none";
  serverStatusIconDisconnected.style.display = "inline-block";
});  

socket.on("data", (response) => {
  if (response == "empty") {
    humidityChartContainer.innerHTML = '&nbsp;';
    humidityChartContainer.innerHTML = '<canvas id="humidity-chart"></canvas>';

    temperatureChartContainer.innerHTML = '&nbsp;';
    temperatureChartContainer.innerHTML = '<canvas id="temperature-chart"></canvas>';
    
    infoMessage.style.display = "inline-block";
  } else {
    if (response.date == dateInput.value) {
      humidityChartContainer.innerHTML = '&nbsp;';
      humidityChartContainer.innerHTML = '<canvas id="humidity-chart"></canvas>';

      temperatureChartContainer.innerHTML = '&nbsp;';
      temperatureChartContainer.innerHTML = '<canvas id="temperature-chart"></canvas>';

      humidityCanvas = document.getElementById('humidity-chart');
      temperatureCanvas = document.getElementById('temperature-chart');
      
      let humidityCtx = humidityCanvas.getContext('2d');
      let temperatureCtx = temperatureCanvas.getContext('2d');
      
      infoMessage.style.display = "none";
      humidityChart = getChart(humidityCtx, "humidity", "%", response.data.humidity, response.data.time, 100);
      temperatureChart = getChart(temperatureCtx, "temperature", "°C", response.data.temperature, response.data.time, 50);
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
