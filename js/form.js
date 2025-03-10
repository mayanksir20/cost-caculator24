export async function populateModalForm() {
  try {
    // ✅ Get form values
    const email = document.getElementById('email').value.trim();
    const fname = document.getElementById('firstName').value.trim();
    const sname = document.getElementById('lastName').value.trim();
    const organisation = document.getElementById('organization').value.trim();
    const formCityCounty = document.getElementById('formCityCounty').value.trim();
    const formState = document.getElementById('state').value.trim();
    const formMessage = document.getElementById('message').value.trim();

    // ✅ Check if required fields are empty
    if (!email || !firstName || !lastName) {
      alert('❌ Error: Email, First Name, and Last Name are required.');
      return;
    }

    // ✅ Prepare API request payload
    const requestData = {
      fname,
      sname,
      organisation,
      email,
      city: formCityCounty,
      state: formState,
      message: formMessage,
    };

    console.log('Sending Data:', requestData);

    // ✅ Send API request (Replace with actual API URL)
    const apiUrl = 'https://www.shipgigventures.com/lara-api/api/costcalculatorapi'; // ⬅️ Replace with your actual API URL

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ Set request headers
        Accept: 'application/json',
      },
      body: JSON.stringify(requestData), // ✅ Convert data to JSON format
    });

    // ✅ Handle HTTP errors
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // ✅ Get response JSON
    const responseData = await response.json();
    console.log('✅ API Response:', responseData);

    alert('✅ Email Sent Successfully!');
  } catch (error) {
    console.error('❌ API Request Failed:', error);
    alert('❌ Failed to send email. Please try again later.');
  }
}

window.populateModalForm = populateModalForm;
