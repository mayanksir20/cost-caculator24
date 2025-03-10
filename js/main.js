// main.js

import {
  initializeDropdowns,
  addChangeListener,
  addInputListener,
  handleSubmitButton,
} from './formHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dropdowns and populate states
  initializeDropdowns();

  // Add dropdown listeners
  addChangeListener(document.getElementById('publicPrivateSelect'), 'Entity Type');
  addChangeListener(document.getElementById('cityCountySelect'), 'Management Area');
  addChangeListener(document.getElementById('stateDropdown'), 'Service State');
  addChangeListener(document.getElementById('cityCounty'), 'City/County');
  addChangeListener(document.getElementById('payRateSelect'), 'Pay Rate Type');

  // Add input field listeners
  addInputListener(document.getElementById('cartsFleet'), 'Cart In Fleet');
  addInputListener(document.getElementById('totalEmployee'), 'Total Employees');
  addInputListener(document.getElementById('numActions'), 'Actions Per Day');
  addInputListener(document.getElementById('numVehicles'), 'Vehicles');
  addInputListener(document.getElementById('actionsCalls'), 'Service Actions/Calls');
  addInputListener(document.getElementById('SupManagers'), 'Supervisors And Managers');
  addInputListener(document.getElementById('Other'), 'Others');

  // Handle form submission
  handleSubmitButton('https://www.shipgigventures.com/lara-api/api/cost-calculator'); // Replace with your API URL


});


