document.addEventListener('DOMContentLoaded', function () {
  const resultContainer = document.getElementById('resultContainer');
  const companyName = document.getElementById('cityOrCounty');

  try {
    // ✅ `window.name` से डेटा लोड करें
    const storedData = JSON.parse(window.name);

    if (!storedData || !storedData.data) {
      throw new Error('Invalid data received');
    }

    // ✅ पहला कंपनी नाम प्राप्त करें
    const companyNameValue = storedData.data.NoOfEmployees[0]['company-1'];

    // ✅ डेटा UI में दिखाएं
    companyName.innerHTML = `<p>${companyNameValue}</p>`;

    // ✅ डेटा को चार्ट में पास करें
    loadEmployeeChartData(storedData.data.NoOfEmployees);
    loadVehicleChartData(storedData.data.noOfVehicles);
    loadEmployeeCostsChartData(storedData.data.empCost);
    loadVehicleCostsChartData(storedData.data.vehicleCost);
    loadSavingsChartData(storedData.data.savingPerWeek);
    loadSavingsYearChartData(storedData.data.savingPerYear);
    loadActionPieChartData(storedData.data.Action);

    // ✅ डेटा को क्लियर करें (ताकि रीफ्रेश करने पर डेटा न रहे)
    window.name = '';
  } catch (error) {
    console.error('Error receiving data:', error);
    resultContainer.innerHTML = '<p>Error receiving data.</p>';
  }
});

// ---------- Updated loadEmployeeChartData to Accept Data ----------
function loadEmployeeChartData(employeeData) {
  console.log('Retrieved Data:', employeeData);

  try {
    if (!employeeData || !Array.isArray(employeeData)) {
      throw new Error('Invalid Employee Data');
    }

    const labels = employeeData.map((entry) => {
      const companyNameKey = Object.keys(entry).find((key) => key.startsWith('company'));
      return entry[companyNameKey] || 'Unknown Company';
    });

    const fieldTechsData = employeeData.map((entry) => {
      const fieldTechKey = Object.keys(entry).find((key) => key.startsWith('fieldTechs'));
      return parseFloat((entry[fieldTechKey] || 0).toFixed(2));
    });

    const supervisorsData = employeeData.map((entry) => {
      const supervisorsKey = Object.keys(entry).find((key) => key.startsWith('supervisors'));
      return parseFloat((entry[supervisorsKey] || 0).toFixed(2));
    });

    const ctx = document.getElementById('NoOfEmployee').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Field Techs',
            data: fieldTechsData,
            backgroundColor: '#2c3e50',
          },
          {
            label: '# of Supervisors',
            data: supervisorsData,
            backgroundColor: '#5DADE2',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => {
                const datasetIndex = tooltipItems[0].datasetIndex;
                return `Series: ${tooltipItems[0].chart.data.datasets[datasetIndex].label}`;
              },
              label: (tooltipItem) => {
                return `Point: "${tooltipItem.label}"`; // Company Name
              },
              afterLabel: (tooltipItem) => {
                return `Value: ${tooltipItem.raw.toFixed(2)}`;
              },
            },
          },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'white',
            font: {
              weight: 'bold',
              size: 10,
            },
            formatter: (value) => value.toFixed(2),
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toFixed(2);
              },
            },
          },
          y: {
            stacked: true,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  } catch (error) {
    console.error('Error generating Employee Chart:', error);
  }
}

// -------bar-chart--vehicles----js---

async function loadVehicleChartData(noOfVehicles) {
  try {
    if (!noOfVehicles || !Array.isArray(noOfVehicles)) {
      throw new Error('Invalid Vehicle Data');
    }

    // Extract labels and vehicle counts dynamically
    const labels = noOfVehicles.map((entry) => {
      const companyNameKey = Object.keys(entry).find((key) => key.startsWith('vcost'));
      return entry[companyNameKey] || 'Unknown Company';
    });

    const vehiclesData = noOfVehicles.map((entry) => {
      const fieldTechKey = Object.keys(entry).find((key) => key.startsWith('fieldTechs'));
      return entry[fieldTechKey] || 0;
    });

    // Chart.js setup
    const ctx2 = document.getElementById('NoOfVehicles').getContext('2d');

    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Vehicles',
            data: vehiclesData,
            backgroundColor: '#2c3e50',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => {
                return 'Series: # of Vehicles'; // Show series first
              },
              label: (tooltipItem) => {
                return `Point: "${tooltipItem.label}"`; // City or county in quotes
              },
              afterLabel: (tooltipItem) => {
                return `Value: ${tooltipItem.raw}`; // Show vehicle count
              },
            },
          },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'white',
            font: {
              weight: 'bold',
              size: 10,
            },
            formatter: (value) => value,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  } catch (error) {
    console.error('Error generating Vehicle Chart:', error);
  }
}


// --------------bar-chart-of-employee-costs---js---

async function loadEmployeeCostsChartData(empCost) {
  try {
    // Validate incoming data
    if (!empCost || !Array.isArray(empCost)) {
      throw new Error("Invalid Employee Cost Data");
    }

    // Extract labels dynamically
    const labels = empCost.map((entry) => {
      const companyKey = Object.keys(entry).find((key) => key.startsWith("empC"));
      return entry[companyKey] || "Unknown Company";
    });

    // Extract and format Wages
    const wagesData = empCost.map((entry) => {
      const wagesKey = Object.keys(entry).find((key) => key.startsWith("PersonnelCostWages"));
      return parseFloat(entry[wagesKey] || 0).toFixed(2);
    });

    // Extract and format Benefits
    const benefitsData = empCost.map((entry) => {
      const benefitsKey = Object.keys(entry).find((key) => key.startsWith("PersonnelCostBenefits"));
      return parseFloat(entry[benefitsKey] || 0).toFixed(2);
    });

    // Chart.js setup
    const ctx3 = document.getElementById("EmployeeCost").getContext("2d");

    new Chart(ctx3, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Wages",
            data: wagesData,
            backgroundColor: "#2c1e1e",
          },
          {
            label: "Benefits",
            data: benefitsData,
            backgroundColor: "#5DADE2",
          },
        ],
      },
      options: {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => {
                const datasetIndex = tooltipItems[0].datasetIndex;
                return `Series: ${tooltipItems[0].chart.data.datasets[datasetIndex].label}`;
              },
              label: (tooltipItem) => {
                return `Point: "${tooltipItem.label}"`; // Company Name inside quotes
              },
              afterLabel: (tooltipItem) => {
                return `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
          datalabels: {
            display: true, // Display data labels
            anchor: "center",
            align: "center",
            color: "white",
            font: {
              weight: "bold",
              size: 10,
            },
            formatter: (value) =>
              `$${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`, // Format as currency
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
          },
          y: {
            stacked: true,
          },
        },
      },
      plugins: [ChartDataLabels], // Enable Data Labels Plugin
    });
  } catch (error) {
    console.error("Error generating Employee Costs Chart:", error);
  }
}

// ---------bar-chart--vechicle--costs--js-------

async function loadVehicleCostsChartData(vehicleCost) {
  try {
    // Validate incoming data
    if (!vehicleCost || !Array.isArray(vehicleCost)) {
      throw new Error("Invalid Vehicle Cost Data");
    }

    // Extract Labels and Data Dynamically
    const labels = vehicleCost.map((entry) => {
      const companyKey = Object.keys(entry).find((key) => key === "county" || key === "cart");
      return entry[companyKey] || "Unknown Company";
    });

    // Extract and format Truck Cost
    const truckCostData = vehicleCost.map((entry) => {
      const truckCostKey = Object.keys(entry).find((key) => key.includes("truckCost"));
      return parseFloat(entry[truckCostKey] || 0).toFixed(2);
    });

    // Extract and format Fuel Cost
    const fuelData = vehicleCost.map((entry) => {
      const fuelKey = Object.keys(entry).find((key) => key.includes("fuel"));
      return parseFloat(entry[fuelKey] || 0).toFixed(2);
    });

    // Extract and format Maintenance & Insurance Cost
    const maintenanceData = vehicleCost.map((entry) => {
      const maintKey = Object.keys(entry).find((key) => key.includes("maintInsurance"));
      return parseFloat(entry[maintKey] || 0).toFixed(2);
    });

    // Chart.js setup
    const ctx4 = document.getElementById("VehicleCost").getContext("2d");

    new Chart(ctx4, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Truck Cost",
            data: truckCostData,
            backgroundColor: "#2c3e50",
          },
          {
            label: "Fuel",
            data: fuelData,
            backgroundColor: "#5DADE2",
          },
          {
            label: "Maint, Insurance, Etc...",
            data: maintenanceData,
            backgroundColor: "#8B7D6B",
          },
        ],
      },
      options: {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => {
                const datasetIndex = tooltipItems[0].datasetIndex;
                return `Series: ${tooltipItems[0].chart.data.datasets[datasetIndex].label}`;
              },
              label: (tooltipItem) => {
                return `Point: "${tooltipItem.label}"`; // Company Name inside quotes
              },
              afterLabel: (tooltipItem) => {
                return `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
          datalabels: {
            display: true,
            anchor: function (context) {
              return context.dataset.data[context.dataIndex] < 100 ? "end" : "center"; // Move small values outside
            },
            align: function (context) {
              return context.dataset.data[context.dataIndex] < 100 ? "end" : "center"; // Align small values outside
            },
            color: function (context) {
              return context.dataset.data[context.dataIndex] < 100 ? "#000" : "#fff"; // Dark text for small values
            },
            font: {
              weight: "bold",
              size: 10,
            },
            formatter: (value) =>
              `$${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`, // Format as currency
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
          },
          y: {
            stacked: true,
          },
        },
      },
      plugins: [ChartDataLabels], // Enable Data Labels Plugin
    });
  } catch (error) {
    console.error("Error generating Vehicle Costs Chart:", error);
  }
}

// ---------bar-chart--Saving--js-------

async function loadSavingsChartData(savingPerWeek) {
  try {
    // Validate incoming data
    if (!savingPerWeek || !Array.isArray(savingPerWeek)) {
      throw new Error("Invalid Saving Per Week Data");
    }

    // Extract Labels and Data
    const labels = [];
    const savingsData = [];

    // Keys to be plotted
    const keysToPlot = ["countyCoS", "Employee", "Vehicle", "Other", "NCSCoS"];

    savingPerWeek.forEach((entry) => {
      keysToPlot.forEach((key) => {
        if (entry[key] !== undefined) {
          labels.push(key);
          savingsData.push(parseFloat(entry[key] || 0).toFixed(2));
        }
      });
    });

    // Chart.js setup
    const ctx5 = document.getElementById("monthSaving").getContext("2d");

    new Chart(ctx5, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Savings",
            data: savingsData,
            backgroundColor: savingsData.map((value) =>
              value < 0
                ? "rgba(93, 173, 226, 0.5)" // Light blue for negative values
                : value > 15000
                ? "#1C1C1C" // Darker for high values
                : "#5DADE2" // Default blue
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30, // Extra space for large values
          },
        },
        plugins: {
          legend: {
            display: false, // No legend needed
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => {
                return 'Series: "Savings"'; // Show series first
              },
              label: (tooltipItem) => {
                return `Point: "${tooltipItem.label}"`; // Key inside quotes
              },
              afterLabel: (tooltipItem) => {
                return `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              },
            },
          },
          datalabels: {
            color: function (context) {
              return context.dataset.data[context.dataIndex] > 15000 ? "#fff" : "#000"; // White text for dark bars
            },
            font: {
              weight: "bold",
              size: 10,
            },
            formatter: function (value) {
              return value < 0
                ? `$(${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                : `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            },
            anchor: function (context) {
              return context.dataset.data[context.dataIndex] > 15000 ? "end" : "center"; // Adjust anchor for big values
            },
            align: function (context) {
              return context.dataset.data[context.dataIndex] > 15000 ? "start" : "top"; // Push large values slightly down
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Enable Data Labels Plugin
    });
  } catch (error) {
    console.error("Error loading Savings JSON data:", error);
  }
}

// -------bar-chart--Saving-per-year--js----
async function loadSavingsYearChartData(savingPerYear) {
  try {
    // Validate incoming data
    if (!savingPerYear || !Array.isArray(savingPerYear) || savingPerYear.length === 0) {
      throw new Error('Invalid Saving Per Year Data');
    }

    // Extract Total Savings
    const totalSavingsEntry = savingPerYear[0]; // Assuming only one entry
    const savingsAmount = totalSavingsEntry[Object.keys(totalSavingsEntry)[0]]; // Extract value

    // Chart.js setup
    const ctx6 = document.getElementById('YearlySaving').getContext('2d');

    new Chart(ctx6, {
      type: 'bar',
      data: {
        labels: ['Total $'], // Fixed label
        datasets: [
          {
            label: 'Total', // Fixed series name
            data: [savingsAmount],
            backgroundColor: '#1C1C1C', // Dark bar color
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => 'Series 1 Point "Total', // Tooltip title as "Total"
              label: (tooltipItem) => `$${Number(tooltipItem.raw).toLocaleString()}`, // Show only "$<amount>"
            },
          },
          datalabels: {
            color: 'rgba(255, 255, 255, 0.9)', // Light gray text inside the bar
            font: {
              weight: 'bold',
              size: 12,
            },
            formatter: (value) => `$${value.toLocaleString()}`, // Always starts with "$"
            anchor: 'center',
            align: 'center',
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: savingsAmount * 1.3, // Adjust height range dynamically
            ticks: {
              callback: (value) => `$${value.toLocaleString()}`, // Format Y-axis labels as currency
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Enable data labels
    });
  } catch (error) {
    console.error('Error loading Savings Year JSON data:', error);
  }
}

// ----------pai-chart--$Action-----

async function loadActionPieChartData(Action) {
  try {
    // Validate incoming data
    if (!Action || !Array.isArray(Action)) {
      throw new Error('Invalid Action Data');
    }

    // Original colors (Now: "National Cart" = Light, "County" = Dark)
    const lightColors = ['#5DADE2']; // Light colors for "National Cart"
    const darkColors = ['#2c3e50']; // Dark colors for "County"

    // Extract Labels and Data Values Dynamically
    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    Action.forEach((entry) => {
      // Find label and value keys dynamically
      const labelKey = Object.keys(entry).find((key) => key.startsWith('Action-County'));
      const valueKey = Object.keys(entry).find((key) => key.endsWith('value'));

      const label = entry[labelKey] || 'Unknown';
      const value = parseFloat(entry[valueKey] || 0).toFixed(2);

      labels.push(label);
      dataValues.push(value);

      // Apply light/dark colors
      if (label.includes('National Cart')) {
        backgroundColors.push(lightColors[backgroundColors.length % lightColors.length]);
      } else {
        backgroundColors.push(darkColors[backgroundColors.length % darkColors.length]);
      }
    });

    // Chart.js setup
    const ctx7 = document.getElementById('Action').getContext('2d');

    new Chart(ctx7, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: {
            display: false, // Disable default legend
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => 'Series: "$/Action"',
              label: (tooltipItem) => `Point: "${tooltipItem.label}"`,
              afterLabel: (tooltipItem) => `Value: ${Number(tooltipItem.raw).toFixed(2)}%`,
            },
          },
          datalabels: {
            color: '#FFFFFF',
            font: {
              weight: 'bold',
              size: 10,
            },
            formatter: (value) => `${Number(value).toFixed(2)}%`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    // ✅ Dynamically Create and Append the Legend Below the Chart
    const chartCanvas = document.getElementById('Action');
    const chartContainer = chartCanvas.parentNode;

    // Remove any existing legend
    const existingLegend = chartContainer.querySelector('.dynamic-legend');
    if (existingLegend) {
      existingLegend.remove();
    }

    // Create the legend container dynamically
    const legendContainer = document.createElement('div');
    legendContainer.classList.add('dynamic-legend');
    legendContainer.style.display = 'flex';
    legendContainer.style.justifyContent = 'center';
    legendContainer.style.flexWrap = 'wrap';
    legendContainer.style.marginTop = '10px';

    // Create legend items
    labels.forEach((label, index) => {
      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.margin = '5px 10px';

      const colorBox = document.createElement('span');
      
      colorBox.style.width = '12px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = backgroundColors[index]; // Ensure correct color is applied
      colorBox.style.display = 'inline-block';
      colorBox.style.marginRight = '5px';
      colorBox.style.borderRadius = '2px';
      colorBox.style.border = '1px solid #000'; // Optional border for better visibility

      const textLabel = document.createElement('span');
      textLabel.textContent = label;

      legendItem.appendChild(colorBox);
      legendItem.appendChild(textLabel);
      legendContainer.appendChild(legendItem);
    });

    // Append the dynamically created legend below the chart
    chartContainer.appendChild(legendContainer);
  } catch (error) {
    console.error('Error loading Action Pie Chart JSON data:', error);
  }
}
