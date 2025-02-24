// -------------------- TOGGLE BUTTON FOR Optional CONTENT --------------------

document.getElementById('toggleBtn').addEventListener('click', function (event) {
  event.preventDefault();

  const labelContent = document.getElementById('specificLabelContent');
  labelContent.classList.toggle('show');
  const icon = this.querySelector('i');
  if (labelContent.classList.contains('show')) {
    icon.classList.remove('fa-minus');
    icon.classList.add('fa-plus');
  } else {
    icon.classList.remove('fa-plus');
    icon.classList.add('fa-minus');
  }
});

// Format hourly rate inputs to always start with "$"
document.querySelectorAll('.hourly-rate').forEach(function (input) {
  input.addEventListener('input', function (e) {
    let value = e.target.value;
    if (!value.startsWith('$')) {
      value = value.replace(/[^0-9]/g, '');
    } else {
      value = value.substring(1).replace(/[^0-9]/g, '');
    }
    e.target.value = value;
  });

  // Prevent modification of "$" symbol
  input.addEventListener('keydown', function (e) {
    if (e.target.selectionStart === 0 && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  });
});

// -------------------- NAVBAR TOGGLE FUNCTIONALITY --------------------

// Define navbar UI variables
const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');
allEventListners();

function allEventListners() {
  navToggler.addEventListener('click', togglerClick);
  navLinks.forEach((elem) => elem.addEventListener('click', navLinkClick));
}
function togglerClick() {
  navToggler.classList.toggle('toggler-open');
  navMenu.classList.toggle('open');

  if (navMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

// Function to close navbar when a nav link is clicked
function navLinkClick() {
  if (navMenu.classList.contains('open')) {
    navToggler.click();
  }
}

// Highlight active nav link based on current URL
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.site-navbar ul li a');

  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
});

// -------------------- MANDATORY INFORMATION SECTION --------------------

document.addEventListener('DOMContentLoaded', () => {
  // Get dropdown and label elements
  const cityCountySelect = document.getElementById('cityCountySelect');
  const stateDropdown = document.getElementById('stateDropdown');
  const cityCounty = document.getElementById('cityCounty');
  const locationLabel = document.getElementById('locationLabel');

  // Disable state and location dropdowns by default
  stateDropdown.disabled = true;
  cityCounty.disabled = true;
  locationLabel.style.color = 'gray';

  // Event listener for City/County dropdown
  cityCountySelect.addEventListener('change', function () {
    const selectedOption = capitalize(cityCountySelect.value);
    if (selectedOption) {
      stateDropdown.disabled = false; // Enable state dropdown
      locationLabel.textContent = `In what ${capitalize(
        selectedOption,
      )} is the service being performed?`;
    } else {
      // Reset if no valid selection
      stateDropdown.disabled = true;
      cityCounty.disabled = true;
      locationLabel.style.color = 'gray';
      locationLabel.textContent = 'In what County is the service being performed?';
    }
  });

  // Event listener for State dropdown
  stateDropdown.addEventListener('change', function () {
    const selectedState = stateDropdown.value;

    if (selectedState) {
      cityCounty.disabled = false; // Enable city/county dropdown
      locationLabel.style.color = ''; // Activate label
    } else {
      cityCounty.disabled = true;
      locationLabel.style.color = 'gray';
    }
  });

  // Helper function to capitalize first letter
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});

// -------------------- PAY RATE SELECTION FUNCTIONALITY --------------------
document.addEventListener('DOMContentLoaded', function () {
  const payRateSelect = document.getElementById('payRateSelect');

  // Rate input fields
  const rateInputs = [
    document.getElementById('actionCallRate'),
    document.getElementById('SupManagRate'),
    document.getElementById('otherRate'),
  ];

  // Corresponding rate labels
  const rateLabels = [
    document.querySelector("p[for='actionsRate']"),
    document.querySelector("p[for='SupManagRate']"),
    document.querySelector("p[for='otherRate']"),
  ];

  // Disable rate inputs by default
  rateInputs.forEach((input) => {
    input.disabled = true;
  });

  // Event listener for Pay Rate dropdown
  payRateSelect.addEventListener('change', function () {
    const selectedValue = payRateSelect.value;

    if (selectedValue === 'Hourly') {
      // Enable inputs when "Hourly" is selected
      rateInputs.forEach((input) => {
        input.disabled = false;
      });

      // Update labels to "Hourly Rate"
      rateLabels.forEach((label) => {
        label.textContent = 'Hourly Rate:';
      });
    } else if (selectedValue === 'Annual') {
      // Keep inputs disabled for "Annual" but change labels
      rateInputs.forEach((input) => {
        input.disabled = true;
        input.value = ''; // Clear input value
      });

      // Update labels to "Annual Rate"
      rateLabels.forEach((label) => {
        label.textContent = 'Annual Rate:';
      });
    } else {
      // Handle other selections (or default state)
      rateInputs.forEach((input) => {
        input.disabled = true;
        input.value = ''; // Clear input value
      });

      // Reset labels to default
      rateLabels.forEach((label) => {
        label.textContent = 'Hourly Rate:';
      });
    }
  });
});



 