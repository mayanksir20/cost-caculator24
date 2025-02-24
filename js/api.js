// api.js

// Function to GET states
export function fetchStates() {
    return $.ajax({
        url: 'https://www.shipgigventures.com/lara-api/api/states',
        method: 'GET'
    });
}

// Function to GET cities/counties based on state and type
export function fetchLocations(state, type) {
    return $.ajax({
        url: 'https://www.shipgigventures.com/lara-api/api/dropdown-data',
        method: 'GET',
        data: { state, type }
    });
}

// Function to POST form data with proper structure
export async function postFormData(apiUrl, formData) {
  try {
    // console.log('Sending FormData:', JSON.stringify(formData, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const responseText = await response.text(); // Read raw text in case of HTML error

    // Parse JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      data = { message: responseText }; // Fallback to raw text
    }


    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('An error occurred while submitting the form. Please try again.');
    throw error;
  }
}


