// utils.js

// Function to collect form data
// utils.js

// Function to collect form data
export function collectFormData() {
  // console.log('Collecting form data...');

  // Helper function to parse required integers
  const parseRequiredInt = (id) => {
    const value = document.getElementById(id)?.value.trim();
    if (!value) {
      throw new Error(`Required field "${id}" is missing or empty.`);
    }
    return parseInt(value, 10);
  };

  // Helper function to parse required strings
  const parseRequiredString = (id) => {
    const value = document.getElementById(id)?.value.trim();
    if (!value) {
      throw new Error(`Required field "${id}" is missing or empty.`);
    }
    return value;
  };

  // Helper function to parse optional integers (defaults to 0)
  const parseOptionalInt = (id) => {
    const value = document.getElementById(id)?.value.trim();
    return value ? parseInt(value, 10) : 0;
  };

  // Helper function to parse optional strings (defaults to '')
  const parseOptionalString = (id) => {
    const value = document.getElementById(id)?.value.trim();
    return value || '';
  };

  return {
    // Required fields (throw error if missing)
    f9: parseRequiredString('publicPrivateSelect'),
    f10: parseRequiredString('cityCountySelect'),
    f11: parseRequiredString('stateDropdown'),
    f12: parseRequiredString('cityCounty'),

    f16: parseRequiredInt('cartsFleet'),
    f18: parseRequiredInt('totalEmployee'),
    f29: parseRequiredInt('numActions'),
    f42: parseRequiredInt('numVehicles'),

    // Optional fields (send 0 or '' if empty)
    l49: parseOptionalString('payRateSelect'),  // Optional string
    f51: parseOptionalInt('actionsCalls'),      // Optional numeric
    f52: parseOptionalInt('SupManagers'),       // Optional numeric
    f53: parseOptionalInt('Other'),             // Optional numeric   
    l51: parseOptionalInt('actionCallRate'),    // Optional numeric
    l52: parseOptionalInt('SupManagRate'),      // Optional numeric
    l53: parseOptionalInt('otherRate'),         // Optional numeric   
    f54: parseOptionalInt('total'),             // Optional numeric 
  };
}


// Function to calculate total employees
export function calculateTotalEmployees() {
  const empActionsValue = parseInt(document.getElementById('actionsCalls').value) || 0;
  const supervisorsValue = parseInt(document.getElementById('SupManagers').value) || 0;
  const otherValue = parseInt(document.getElementById('Other').value) || 0;

  const total = empActionsValue + supervisorsValue + otherValue;
  document.getElementById('total').value = total;

  // console.log(`Total Employees: ${total}`);
}
