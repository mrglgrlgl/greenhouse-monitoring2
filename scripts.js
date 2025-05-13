// Configuration
const SENSOR_UPDATE_INTERVAL = 2000;

// DOM references
const elements = {
  temperature: document.getElementById('temperature'),
  humidity: document.getElementById('humidity'),
  soil1: document.getElementById('soil1'),
  soil2: document.getElementById('soil2'),
  soil3: document.getElementById('soil3'),
  soilAvg: document.getElementById('soilAvg'),
  exhaustFanStatus: document.getElementById('exhaustFanStatus'),
  coolingFanStatus: document.getElementById('coolingFanStatus'),
  solenoidValveStatus: document.getElementById('solenoidValveStatus'),
  nValue: document.getElementById('nValue'),
  pValue: document.getElementById('pValue'),
  kValue: document.getElementById('kValue'),
  phValue: document.getElementById('phValue'),
  deviceStatus: document.getElementById('deviceStatus'),
  lastUploadTime: document.getElementById('lastUploadTime')
};

// Fetch and apply data from data.json 
// function fetchSensorData() {
//   fetch('data.json')
//     .then(res => res.json())
//     .then(updateUI)
//     .catch(err => console.error('Failed to load data.json:', err));
// }


//replace function above

const ESP32_IP = '192.168.1.42';        // <- set to your ESP32’s IP
const SENSOR_ENDPOINT = `http://${ESP32_IP}/sensor`;

function fetchSensorData() {
  fetch(SENSOR_ENDPOINT)
    .then(res => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(data => updateUI(data))
    .catch(err => console.error('ESP32 fetch error:', err));
}



// Update the UI
function updateUI(data) {
  elements.temperature.textContent   = `${data.temperature} °C`;
  elements.humidity.textContent      = `${data.humidity} %`;
  elements.soil1.textContent         = `${data.soil1} %`;
  elements.soil2.textContent         = `${data.soil2} %`;
  elements.soil3.textContent         = `${data.soil3} %`;

  const avgSoil = (
    (parseFloat(data.soil1)
      + parseFloat(data.soil2)
      + parseFloat(data.soil3))
    / 3
  ).toFixed(1);
  elements.soilAvg.textContent       = `${avgSoil} %`;

  elements.exhaustFanStatus.textContent   = data.exhaustFanStatus;
  elements.coolingFanStatus.textContent   = data.coolingFanStatus;
  elements.solenoidValveStatus.textContent= data.solenoidValveStatus;

  elements.nValue.textContent   = data.nitrogen;
  elements.pValue.textContent   = data.phosphorus;
  elements.kValue.textContent   = data.potassium;
  elements.phValue.textContent  = data.ph;

  elements.deviceStatus.textContent    = data.deviceStatus;
  elements.lastUploadTime.textContent  = new Date().toLocaleTimeString();
}

// Photo upload (unchanged)
async function uploadPhotos(event) {
  event.preventDefault();
  /* … */
}

// Main initialization
function init() {
  setInterval(fetchSensorData, SENSOR_UPDATE_INTERVAL);
  fetchSensorData();

  document
    .getElementById('uploadForm')
    .addEventListener('submit', uploadPhotos);
}

document.addEventListener('DOMContentLoaded', init);
