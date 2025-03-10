document.addEventListener('DOMContentLoaded', function () {
  const resultContainer = document.getElementById('resultContainer');
  const companyName = document.getElementById('cityOrCounty');
  const stateName = document.getElementById('stateName');
  const summary1Element = document.getElementById('Summary1');
  const summary2Element = document.getElementById('Summary2');
  const cityorcountyinput = document.getElementById('formCityCounty');
  const stateformInput = document.getElementById('state');

  //form

  try {
    // ✅ Load data from localStorage

    const storedData = JSON.parse(localStorage.getItem('formData'));

    if (!storedData || !storedData.data) {
      throw new Error('Invalid data received from localStorage');
    }

    console.log('✅ Loaded formData:', storedData);
    console.log('✅ State Name (f11):', storedData.f11);

    // ✅ Display first company name (with null checks)
    const noOfEmployees = storedData.data.data?.NoOfEmployees;

    if (companyName && noOfEmployees && noOfEmployees.length > 0) {
      const companyNameValue = noOfEmployees[0]['company-1'] || 'N/A';
      companyName.innerHTML = `<p>${companyNameValue}</p>`;
      cityorcountyinput.value = companyNameValue;
      stateformInput.value = storedData.f11;
    } else {
      console.error("⚠️ 'cityOrCounty' element not found or 'NoOfEmployees' data is missing.");
      if (companyName) {
        companyName.innerHTML = '<p>N/A</p>';
      }
    }

    // ✅ Display State Name
    if (stateName) {
      const stateValue = storedData.f11 || 'N/A';
      stateName.innerHTML = `<p>${stateValue}</p>`;
    } else {
      console.error("⚠️ Element with id 'stateName' not found.");
    }

    //✅ Bind Summary Data
    const summaryData = storedData.data.data?.Summary;
    // console.log(storedData.data + "<br/>"+ summaryData + "check me out");
    if (summary1Element && summaryData && summaryData.length > 0) {
      if (summary1Element) {
        summary1Element.innerHTML = `${summaryData[0]['Summary1'] || 'N/A'}`;
        console.log(summaryData);
      } else {
        console.log(summaryData);
        console.error("⚠️ Element with id 'Summary1' not found.");
      }
    }
    if (summary2Element && summaryData && summaryData.length > 0) {
      if (summary2Element) {
        summary2Element.innerHTML = `${summaryData[0]['Summary2'] || 'N/A'}`;
      } else {
        console.error("⚠️ Element with id 'Summary2' not found.");
      }
    }

    // ✅ Pass data to charts with checks
    if (noOfEmployees) loadEmployeeChartData(noOfEmployees);
    if (storedData.data.data?.noOfVehicles) loadVehicleChartData(storedData.data.data.noOfVehicles);
    if (storedData.data.data?.empCost) loadEmployeeCostsChartData(storedData.data.data.empCost);
    if (storedData.data.data?.vehicleCost)
      loadVehicleCostsChartData(storedData.data.data.vehicleCost);
    if (storedData.data.data?.savingPerWeek)
      loadSavingsChartData(storedData.data.data.savingPerWeek);
    if (storedData.data.data?.savingPerYear)
      loadSavingsYearChartData(storedData.data.data.savingPerYear);
    if (storedData.data.data?.Action) loadActionPieChartData(storedData.data.data.Action);

    // ✅ Optional: Clear localStorage after processing
    // localStorage.removeItem('formData'); // Uncomment to clear data after use
  } catch (error) {
    console.error('❌ Error processing data:', error);
    if (resultContainer) {
      resultContainer.innerHTML = '<p>Error receiving or processing data.</p>';
    }
  }
});

///////////////////////////////////////////////////////////////
// ---------- Load Employee Chart ----------
function loadEmployeeChartData(employeeData) {
  console.log('Retrieved Employee Data:', employeeData);

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
      return parseFloat(entry[fieldTechKey]) || 0; // ✅ Ensure 0 values are included
    });

    const supervisorsData = employeeData.map((entry) => {
      const supervisorsKey = Object.keys(entry).find((key) => key.startsWith('supervisors'));
      return parseFloat(entry[supervisorsKey]) || 0; // ✅ Ensure 0 values are included
    });

    // ✅ Fix: Correct max value calculation
    const maxValue = Math.max(...fieldTechsData, ...supervisorsData);

    const ctx = document.getElementById('NoOfEmployee').getContext('2d');

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Field Techs',
            data: fieldTechsData,
            backgroundColor: '#2c3e50',
            minBarLength: 60,
          },
          {
            label: '# of Supervisors',
            data: supervisorsData,
            backgroundColor: '#69ABC3',
            minBarLength: 30,
          
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => `Series: ${tooltipItems[0].dataset.label}`,
              label: (tooltipItem) => `Point: "${tooltipItem.label}"`,
              afterLabel: (tooltipItem) => `Value: ${tooltipItem.raw}`,
            },
          },
          datalabels: {
            display: true,
            color: 'white',
            font: { size: 15, family: 'aptos narrow' },
            formatter: (value) => `${value.toFixed(0)}`, // ✅ Ensure 0 values are displayed as "0"
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: maxValue * 1.5, // ✅ Correct max scaling
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
          },
          y: {
            stacked: true,
            ticks: { display: true },
            grid: { display: false, drawBorder: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    createChart(ctx, chartConfig, 'NoOfEmployee'); // Ensure `createChart` is defined
  } catch (error) {
    console.error('Error generating Employee Chart:', error);
  }
}


///////////////////////////////////////////////////////////////
// ---------- Load Vehicle Chart ----------
async function loadVehicleChartData(noOfVehicles) {
  console.log('Retrieved Vehicle Data:', noOfVehicles);

  try {
    if (!noOfVehicles || !Array.isArray(noOfVehicles)) {
      throw new Error('Invalid Vehicle Data');
    }

    const labels = noOfVehicles.map((entry) => {
      const companyNameKey = Object.keys(entry).find((key) => key.startsWith('vcost'));
      return entry[companyNameKey] || 'Unknown Company';
    });

    const vehiclesData = noOfVehicles.map((entry) => {
      const fieldTechKey = Object.keys(entry).find((key) => key.startsWith('fieldTechs'));
      return entry[fieldTechKey] || 0;
    });

    const ctx = document.getElementById('NoOfVehicles').getContext('2d');

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Vehicles',
            data: vehiclesData,
            backgroundColor: '#2c3e50',
            minBarLength: 60,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => 'Series: # of Vehicles',
              label: (tooltipItem) => `Point: "${tooltipItem.label}"`,
              afterLabel: (tooltipItem) => `Value: ${tooltipItem.raw}`,
            },
            titleFont: { family: 'aptos narrow', size: 13, weight: 'bold' },
            bodyFont: { family: 'aptos narrow', size: 12, weight: 'normal' },
            footerFont: { family: 'aptos narrow', size: 10, weight: 'italic' },
          },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'white',
            font: { weight: '', size: 13, family: 'aptos narrow' },
            formatter: (value) => value,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { display: false },
            grid: { display: false, drawBorder: true },
          },
          y: { ticks: { display: true }, grid: { display: false, drawBorder: false } },
        },
      },
      plugins: [ChartDataLabels],
    };

    createChart(ctx, chartConfig, 'NoOfVehicles');
  } catch (error) {
    console.error('Error generating Vehicle Chart:', error);
  }
}

///////////////////////////////////////////////////////////////
// ---------- Load Employee Costs Chart ----------

async function loadEmployeeCostsChartData(empCost) {
  try {
    if (!empCost || !Array.isArray(empCost)) {
      throw new Error('Invalid Employee Cost Data');
    }

    // Extract company names
    const labels = empCost.map((entry) => {
      const companyKey = Object.keys(entry).find((key) => key.startsWith('empC'));
      return entry[companyKey] || 'Unknown Company';
    });

    // Extract wages and benefits data
    let wagesData = empCost.map((entry) => {
      const wagesKey = Object.keys(entry).find((key) => key.startsWith('PersonnelCostWages'));
      return parseFloat(entry[wagesKey]) || 0;
    });

    let benefitsData = empCost.map((entry) => {
      const benefitsKey = Object.keys(entry).find((key) => key.startsWith('PersonnelCostBenefits'));
      return parseFloat(entry[benefitsKey]) || 0;
    });

    // Find the maximum value for proper bar scaling
    const maxValue = Math.max(...wagesData, ...benefitsData);

    // Increase chart width dynamically for better visibility
    document.getElementById('EmployeeCost').style.width = '300px';

    const ctx = document.getElementById('EmployeeCost').getContext('2d');

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels, // Company names
        datasets: [
          {
            label: 'Wages',
            data: wagesData,
            backgroundColor: '#2c3e50',
            minBarLength: 60,
          },
          {
            label: 'Benefits',
            data: benefitsData,
            backgroundColor: '#69ABC3',
            minBarLength: 50,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 20, right: 20, top: 10, bottom: 10 },
        },
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => `Series: ${tooltipItems[0].dataset.label}`,
              label: (tooltipItem) => `Company: "${tooltipItem.label}"`,
              afterLabel: (tooltipItem) =>
                `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`,
            },
          },
          datalabels: {
            display: true,
            color: 'white',
            font: {
              size: 13,
              family: 'aptos narrow',
            },
            formatter: (value) =>
              `$${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`, // ✅ 0 values will now be displayed as "$0"

            anchor: 'center', // Align text inside bars
            align: 'center', // Keep text centered inside bars
            backgroundColor: 'transparent', // No background color for text
            padding: 5,
            borderRadius: 5,
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: maxValue * 2,
            ticks: { display: false }, // Removes numbers along x-axis
            grid: { display: false }, // Removes grid lines
            barPercentage: 0.7, // Ensures bars are thick enough for labels
          },
          y: {
            stacked: true,
            ticks: { display: true, font: { size: 12 } },
            grid: { display: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    createChart(ctx, chartConfig, 'EmployeeCost');
  } catch (error) {
    console.error('Error generating Employee Costs Chart:', error);
  }
}

///////////////////////////////////////////////////////////////
// ---------- Load Vehicle Costs Chart ----------

async function loadVehicleCostsChartData(vehicleCost) {
  try {
    if (!vehicleCost || !Array.isArray(vehicleCost)) {
      throw new Error('Invalid Vehicle Cost Data');
    }

    const labels = vehicleCost.map((entry) => {
      const companyKey = Object.keys(entry).find(
        (key) => key.toLowerCase().includes('vehicle') || key.toLowerCase().includes('cart')
      );
      return entry[companyKey] || 'Unknown Company';
    });

    const truckCostData = vehicleCost.map((entry) => {
      const truckCostKey = Object.keys(entry).find((key) => key.includes('truckCost'));
      return parseFloat(entry[truckCostKey]) || 0;
    });

    const fuelData = vehicleCost.map((entry) => {
      const fuelKey = Object.keys(entry).find((key) => key.includes('fuel'));
      return parseFloat(entry[fuelKey]) || 0;
    });

    const maintenanceData = vehicleCost.map((entry) => {
      const maintKey = Object.keys(entry).find((key) => key.includes('maintInsurance'));
      return parseFloat(entry[maintKey]) || 0;
    });

    // ✅ Find the maximum value for scaling
    const maxValue = Math.max(...truckCostData, ...fuelData, ...maintenanceData);

    const ctx = document.getElementById('VehicleCost').getContext('2d');

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Truck Cost', data: truckCostData, backgroundColor: '#2c3e50', minBarLength: 100 },
          { label: 'Fuel', data: fuelData, backgroundColor: '#69ABC3', minBarLength: 60 },
          { label: 'Maint, Insurance, Etc...', data: maintenanceData, backgroundColor: '#8B7D6B', minBarLength: 50 },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (tooltipItems) => `Series: ${tooltipItems[0].dataset.label}`,
              label: (tooltipItem) => `Point: "${tooltipItem.label}"`,
              afterLabel: (tooltipItem) =>
                `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`,
            },
          },
          datalabels: {
            display: true,
            anchor: 'center', // Ensures labels stay inside the bars
            align: 'center',  // Centers labels inside the bars
            color: 'white',   // Keeps the text color white for better visibility
            font: {
              size: 13,
              family: 'Aptos Narrow',
            },
            formatter: (value) =>
              `$${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`,
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: maxValue * 1.6, // ✅ Ensures proper scaling
            ticks: { display: false },
            grid: { display: false, drawBorder: true },
          },
          y: {
            stacked: true,
            ticks: { display: true },
            grid: { display: false, drawBorder: false },
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    createChart(ctx, chartConfig, 'VehicleCost');
  } catch (error) {
    console.error('Error generating Vehicle Costs Chart:', error);
  }
}


///////////////////////////////////////////////////////////////
// ---------- Load Savings Per Week Chart ----------

async function loadSavingsChartData(savingPerWeek) {
  try {
    if (!savingPerWeek || !Array.isArray(savingPerWeek)) {
      throw new Error('Invalid Saving Per Week Data');
    }

    const labels = [];
    const fullLabels = [];
    const savingsData = [];
    const backgroundColors = [];

    const keysToPlot = ['county CoS', 'Employees', 'Vehicles', 'Other', 'NCS CoS'];

    savingPerWeek.forEach((entry) => {
      keysToPlot.forEach((key) => {
        const mappedKey =
          key === 'Employees'
            ? 'Employee'
            : key === 'county CoS'
            ? 'countyCoS'
            : key === 'NCS CoS'
            ? 'NCSCoS'
            : key === 'Vehicles'
            ? 'Vehicle'
            : key;

        if (entry[mappedKey] !== undefined) {
          let cityOrCounty = entry.city || entry.county || 'Unknown';

          // ✅ Sirf `county CoS` ka format change hoga
          let fullLabel = key === 'county CoS' ? `${cityOrCounty} CoS` : key;

          // ✅ Sirf `county CoS` label par ellipsis lagega agar > 20 characters
          let displayLabel =
            key === 'county CoS' && fullLabel.length > 20
              ? fullLabel.substring(0, 17) + '...'
              : fullLabel;

          labels.push(displayLabel);
          fullLabels.push(fullLabel);
          savingsData.push(parseFloat(entry[mappedKey] || 0));

          let barColor =
            key === 'NCS CoS'
              ? '#2c3e50'
              : key === 'county CoS'
              ? '#2d3420'
              : '#69ABC3';

          backgroundColors.push(barColor);
        }
      });
    });

    const ctx = document.getElementById('monthSaving').getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Savings',
            data: savingsData,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
            position: 'nearest',
            callbacks: {
              title: () => `Series: "Savings"`,
              label: (tooltipItem) => `Point: "${fullLabels[tooltipItem.dataIndex]}"`, 
              afterLabel: (tooltipItem) =>
                `Value: $${Number(tooltipItem.raw).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`,
            },
          },
          datalabels: {
            color: '#000',
            font: { size: 13, family: 'Aptos Narrow' },
            formatter: (value) =>
              value < 0
                ? `$(${Math.abs(value).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })})`
                : `$${Number(value).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`,
            anchor: 'end',
            align: 'top',
            offset: 5,
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 12, color: '#717171' },
              display: true,
              callback: (value, index) => (index % 2 === 0 ? ['', labels[index]] : [labels[index]]),
            },
            grid: { display: false, drawBorder: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              display: false,
              callback: (value) =>
                `$${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`,
            },
            grid: { display: false, drawBorder: false },
          },
        },
        hover: { mode: 'nearest', intersect: false },
      },
      plugins: [ChartDataLabels],
    });

    // **🎯 Custom Tooltip Show on Label Hover**
    document.getElementById('monthSaving').addEventListener('mousemove', (event) => {
      const canvas = event.target;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const xScale = chart.scales.x;
      if (!xScale) return;

      let nearestIndex = null;
      let minDistance = Number.MAX_VALUE;

      xScale.ticks.forEach((tick, index) => {
        const labelX = xScale.getPixelForTick(index);
        const distance = Math.abs(x - labelX);

        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== null && minDistance < 20) {
        chart.tooltip.setActiveElements([{ datasetIndex: 0, index: nearestIndex }], {
          x: xScale.getPixelForTick(nearestIndex),
          y: y,
        });
        chart.update();
      } else {
        chart.tooltip.setActiveElements([], {});
        chart.update();
      }
    });
  } catch (error) {
    console.error('Error loading Savings JSON data:', error);
  }
}


///////////////////////////////////////////////////////////////
// -------bar-chart--Saving-per-year--js----

async function loadSavingsYearChartData(savingPerYear) {
  try {
    if (!savingPerYear || !Array.isArray(savingPerYear) || savingPerYear.length === 0) {
      throw new Error('Invalid Saving Per Year Data');
    }

    // Extract Total Savings
    const totalSavingsEntry = savingPerYear[0]; // Assuming only one entry
    const savingsAmount = parseInt(totalSavingsEntry[Object.keys(totalSavingsEntry)[0]]); // Extract value

    const ctx = document.getElementById('YearlySaving').getContext('2d');

    const chartConfig = {
      type: 'bar',
      data: {
        labels: ['Total $'], // Fixed label at the bottom
        datasets: [
          {
            label: 'Total Savings',
            data: [savingsAmount],
            backgroundColor: '#2c3e50', // Dark bar color
            barThickness: 70, // ✅ Keeps bar size fixed
            maxBarThickness: 100, // ✅ Ensures bar does not stretch
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ✅ Ensures fixed height
        layout: {
          padding: { top: 10, bottom: 20 },
        },
        plugins: {
          legend: { display: false }, // ✅ Hide legend
          tooltip: {
            enabled: true,
            callbacks: {
              title: () => 'Savings Per Year',
              label: (tooltipItem) => `$${Number(tooltipItem.raw).toLocaleString()}`,
            },
          },
          datalabels: {
            color: 'black', // ✅ Keeps text black
            font: { size: 13, family: 'Aptos Narrow'},
            formatter: (value) => `$${value.toLocaleString()}`,
            anchor: 'end', // ✅ Ensures label stays exactly at the top of the bar
            align: 'top', // ✅ Keeps label at the end of the bar
            offset: -3, // ✅ Ensures text does not float away from the bar
            clip: false, // ✅ Prevents text from being cut off
          },
        },
        scales: {
          x: {
            grid: { drawBorder: false }, // ✅ Removes unnecessary borders
            ticks: {
              display: true,
              font: { size: 13, family: 'system-ui', color: '#717171', weight: '' },
            },
          },
          y: {
            display: false, // ✅ Hides numbers along the Y-axis
            beginAtZero: true, // ✅ Prevents bars from shrinking
            max: Math.max(savingsAmount * 1.1, 50000), // ✅ Ensures height is limited dynamically
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    new Chart(ctx, chartConfig); // Directly create the chart
  } catch (error) {
    console.error('Error loading Savings Year JSON data:', error);
  }
}
///////////////////////////////////////////////////////////////
// ----------pai-chart--$Action-----

async function loadActionPieChartData(Action) {
  try {
    // Validate incoming data
    if (!Action || !Array.isArray(Action)) {
      throw new Error('Invalid Action Data');
    }

    // Original colors (Now: "National Cart" = Light, "County" = Dark)
    const lightColors = ['#69ABC3']; // Light colors for "National Cart"
    const darkColors = ['#2c3e50']; // Dark colors for "County"

    // Extract Labels and Data Values Dynamically
    const labels = [];
    const dataValues = [];
    const backgroundColors = [];
    const sliceOffsets = []; // ✅ To store slice offset values

    Action.forEach((entry) => {
      // Find label and value keys dynamically
      const labelKey = Object.keys(entry).find((key) => key.startsWith('Action-County'));
      const valueKey = Object.keys(entry).find((key) => key.endsWith('value'));

      const label = entry[labelKey] || 'Unknown';
      const value = parseFloat(entry[valueKey] || 0).toFixed(2);

      labels.push(label);
      dataValues.push(value);

      // Apply light/dark colors
      if (label.includes('NCS')) {
        backgroundColors.push(lightColors[backgroundColors.length % lightColors.length]);
      } else {
        backgroundColors.push(darkColors[backgroundColors.length % darkColors.length]);
      }

      // ✅ Slightly push each slice outward (5px)
      sliceOffsets.push(7);
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
            borderWidth: 3, // ✅ Increase gap between slices
            borderColor: '#ffffff', // ✅ White border for spacing effect
            hoverBorderWidth: 5, // ✅ Slightly larger border on hover
            offset: sliceOffsets, // ✅ Push slices outward by 5px
            minBarLength: 90,
            
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
            enabled: true, // ✅ Tooltip is enabled
            callbacks: {
              title: (tooltipItems) => tooltipItems[0].label, // ✅ Only show label in tooltip
              label: () => '', // ✅ No extra data (empty string removes value display)
            },
          },
          datalabels: {
            color: '#FFFFFF',
            font: { weight: '', size: 13, family: 'aptos narrow',},
            formatter: (value) => `$${Number(value).toFixed(2)}`,
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

      colorBox.style.width = '35px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = backgroundColors[index];
      colorBox.style.marginRight = '5px';

      const textLabel = document.createElement('span');
      textLabel.textContent = label;
      textLabel.style.fontSize = '13px'; // ✅ Font size set to 10px
      textLabel.style.color = '#717171'; // ✅ Font color set to gray
      textLabel.style.fontFamily = 'system-ui';
      textLabel.style.fontWeight = '400'; // ✅ Font weight set to bold

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

///////////////////////////////////////////////////////////////

let charts = []; // Array to store all chart instances

// ---------- Reusable Function to Create Charts ----------
function createChart(ctx, chartConfig, chartId) {
  // Destroy existing chart if it exists
  let existingChartIndex = charts.findIndex((chartObj) => chartObj.id === chartId);
  if (existingChartIndex !== -1) {
    charts[existingChartIndex].chart.destroy();
    charts.splice(existingChartIndex, 1);
  }

  // Create and store the new chart
  const chart = new Chart(ctx, chartConfig);
  charts.push({ id: chartId, chart });
  return chart;
}
// ---------- Function to Hide Gridlines and Ticks ----------
function hideGridlinesAndTicks(chart) {
  Object.keys(chart.options.scales).forEach((axis) => {
    chart.options.scales[axis].ticks.display = false;
    chart.options.scales[axis].grid.display = false;
    chart.options.scales[axis].grid.drawBorder = false;
  });
  chart.update();
}

// ---------- Function to Restore Gridlines and Ticks ----------
function restoreGridlinesAndTicks(chart) {
  Object.keys(chart.options.scales).forEach((axis) => {
    chart.options.scales[axis].ticks.display = false;
    chart.options.scales[axis].grid.display = false;
    chart.options.scales[axis].grid.drawBorder = false;
  });
  chart.update();
}

// ---------- Print Button Logic ----------
document.querySelector('.print-button').addEventListener('click', () => {
  if (charts.length === 0) return;

  // Hide gridlines and ticks for all charts
  charts.forEach(({ chart }) => hideGridlinesAndTicks(chart));

  // Delay to allow updates before print dialog opens
  setTimeout(() => {
    window.print();

    // Restore gridlines and ticks after printing
    charts.forEach(({ chart }) => restoreGridlinesAndTicks(chart));
  }, 500);
});

// -------nav-toggler-----------------

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

// ✅ Fix: Define navLinkClick function
function navLinkClick() {
  navToggler.classList.remove('toggler-open');
  navMenu.classList.remove('open');
  document.body.style.overflow = 'auto';
}
