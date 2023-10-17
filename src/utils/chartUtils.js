/**
 * Creates chart data for a given set of x and y values.
 * @param {Array<string>} xValues - The x-axis labels for the chart.
 * @param {Array<number>} yValues - The y-axis values for the chart.
 * @param {string} selectedOption - The selected option for the chart.
 * @returns {Object} - An object containing the chart data.
 */
const createChartData = (xValues, yValues, selectedOption) => {
  return {
    labels: xValues,
    datasets: [
      {
        label: selectedOption,
        data: yValues,
        fill: true,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
        color: "rgba(255, 255, 255, 1)",
      },
    ],
  };
};

/**
 * Sets the x and y values for a chart based on a set of items and a selected option.
 * @param {Object} options - An object containing the items, selected option, and state setters.
 */
const setXYValues = ({ items, selectedOption, setXValues, setYValues }) => {
  const xValues = [];
  const yValues = [];

  items.forEach((item) => {
    xValues.push(item.title);
    yValues.push(item[selectedOption]);
  });

  setXValues(xValues);
  setYValues(yValues);
};

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        color: "white",
        font: {
          size: 14,
        },
      },
      gridLines: {
        color: "white",
      },
    },
    x: {
      ticks: {
        color: "white",
        font: {
          size: 14,
        },
      },
      gridLines: {
        color: "white",
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  backgroundColor: "white", // set the chart background color to black with 50% opacity
  color: "white", // set the default text color to white
};

export { createChartData, chartOptions, setXYValues };
