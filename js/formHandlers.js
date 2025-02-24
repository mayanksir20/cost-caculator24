// formHandlers.js

import { fetchStates, fetchLocations, postFormData } from './api.js';
import { collectFormData, calculateTotalEmployees } from './utils.js';

// Initialize dropdowns on page load
export function initializeDropdowns() {
  fetchStates()
    .done((response) => {
      let stateOptions = '<option value="">Select State</option>';
      $.each(response, (index, state) => {
        stateOptions += `<option value="${state}">${state}</option>`;
      });
      $('#stateDropdown').html(stateOptions);
    })
    .fail(() => alert('Error fetching states.'));

  // Event listener for state and city/county dropdowns
  $('#stateDropdown, #cityCountySelect').change(() => {
    const state = $('#stateDropdown').val();
    const type = $('#cityCountySelect').val().toLowerCase();

    if (state && type) {
      fetchLocations(state, type)
        .done((response) => {
          let locationOptions = `<option value="">Select ${type}</option>`;
          $.each(response, (index, value) => {
            locationOptions += `<option value="${value}">${value}</option>`;
          });
          $('#cityCounty').html(locationOptions);
        })
        .fail(() => alert('Error fetching data.'));
    }
  });
}

// Function to add change listener to dropdowns
export function addChangeListener(selectElement, label) {
  selectElement.addEventListener('change', () => {
    const selectedValue = selectElement.value;
    // console.log(`${label}: ${selectedValue || 'Not selected'}`);
  });
}

// Function to add input listener to input fields
export function addInputListener(inputElement, label) {
  inputElement.addEventListener('input', () => {
    // console.log(`${label}: ${inputElement.value || 'Empty'}`);
    calculateTotalEmployees(); // Recalculate total on input
  });
}


// Submit form data on button click with corrected error handling
export function handleSubmitButton(apiUrl) {
  const submitButton = document.getElementById('submitButton');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = collectFormData();

    console.log(`form data ${formData.f11}`);

    try {
      const { ok, status, data } = await postFormData(apiUrl, formData);

      if (ok) {
        const payload = {
          data,             // API response data
          f11: formData.f11 // Include formData.f11
        };

        // ✅ Store data in localStorage instead of window.name
        localStorage.setItem('resultData', JSON.stringify(payload));

        // ✅ Redirect to result.html
        window.location.href = '../result.html';
      } else {
        alert(`Error::: ${data.message || 'An error occurred while submitting the form.'}`);
      }
    } catch (error) {
      alert(`Network error occurred. Details: ${error.message}`);
    }
  });
}

// --------submit-button-validation--

// Function to check if all required fields are filled
function validateForm() {
  // List of required field IDs
  const requiredFields = [
    'publicPrivateSelect',
    'cityCountySelect',
    'stateDropdown',
    'cityCounty',
    'cartsFleet',
    'totalEmployee',
    'numActions',
    'numVehicles',
  ];

  // Check if all fields have values
  const allFilled = requiredFields.every((id) => {
    const element = document.getElementById(id);
    return element && element.value.trim() !== '';
  });

  // Enable or disable the submit button
  const submitButton = document.getElementById('submitButton');
  if (allFilled) {
    submitButton.disabled = false;
    submitButton.classList.add('enabled'); // Apply enabled styling
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove('enabled'); // Revert to disabled styling
  }
}

// Attach event listeners to required fields
window.addEventListener('DOMContentLoaded', () => {
  const requiredFields = document.querySelectorAll('#myForm input[required]');

  requiredFields.forEach((field) => {
    field.addEventListener('input', validateForm); // Validate on input
  });

  // Prevent form submission if required fields are not filled
  document.getElementById('myForm').addEventListener('submit', (e) => {
    if (document.getElementById('submitButton').disabled) {
      e.preventDefault();
      alert('Please fill in all required fields before submitting.');
    }
  });
});
