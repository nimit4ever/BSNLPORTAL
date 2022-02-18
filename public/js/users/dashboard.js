// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Colors for Legend
colors = [
  '#1cc88a',
  '#e74a3b',
  '#4e73df',
  '#f6c23e',
  '#858796',
  '#aa66cc',
  '#3F729B',
  '#afb42b',
  '#6d4c41',
  '#455a64',
  '#e91e63',
  '#1cc88a',
  '#e74a3b',
  '#4e73df',
  '#f6c23e',
  '#858796',
  '#aa66cc',
  '#3F729B',
  '#afb42b',
  '#6d4c41',
  '#455a64',
  '#e91e63',
];

// Legend Callback Function
function legendCallbackFunction(chart) {
  const text = [];
  text.push('<ul class="' + chart.id + '-legend">');
  for (let i = 0; i < chart.data.datasets[0].data.length; i++) {
    text.push(
      `<li>
          <a class="mya" href="${window.location.origin}/${chart.canvas.id.split('_')[1]}?${chart.canvas.id.split('_')[0]}=${
        chart.data.labels[i]
      }">
            <span id="legend-${i}-item" style="background-color: ${chart.data.datasets[0].backgroundColor[i]}">`
    );
    if (chart.data.labels[i]) {
      text.push(`${chart.data.labels[i]} : ${chart.data.datasets[0].data[i]}`);
    }
    text.push('</span></a></li>');
  }
  text.push('</ul>');
  return text.join('');
}

function chartObject(chartKey, chartValue) {
  return {
    type: 'doughnut',
    data: {
      labels: chartKey,
      datasets: [
        {
          data: chartValue,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgb(255,255,255)',
        bodyFontColor: '#858796',
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      legendCallback: legendCallbackFunction,
      cutoutPercentage: 75,
    },
  };
}

function chartCreate(objects, myKey, myValue, filterKey, chartId, chartLegendId, url, query) {
  const collections = objects.reduce((tally, object) => {
    if (object[myKey] === myValue) tally[object[filterKey]] = (tally[object[filterKey]] || 0) + 1;
    return tally;
  }, {});
  const collectionsKey = Object.keys(collections);
  const collectionsValue = collectionsKey.map((key) => {
    return collections[key];
  });

  const collectionChart = new Chart(document.getElementById(chartId), chartObject(collectionsKey, collectionsValue));
  document.getElementById(chartLegendId).innerHTML = collectionChart.generateLegend();
  document.getElementById(chartId).onclick = function (evt) {
    const activePoints = collectionChart.getElementsAtEventForMode(evt, 'point', collectionChart.options);
    const firstPoint = activePoints[0];
    const label = collectionChart.data.labels[firstPoint._index];
    window.location.href = `${window.location.origin}/${url}?${query}${label}`;
  };
}

const role = $('#role').text();

$.get('/orders/api?isActive=ALL', (orders) => {
  // Set dashboard counts Start

  if (!(role === 'NO' || role === 'ADMIN')) {
    $('#myOrderPending').text(
      orders.reduce((count, order) => {
        return order.isActive && (order[role] === false || order.agency === role) ? (count += 1) : count;
      }, 0)
    );
  } else {
    $('#myOrderPending').text(
      orders.reduce((count, order) => {
        return order.isActive ? (count += 1) : count;
      }, 0)
    );

    $('#agencyPending').text(
      orders.reduce((count, order) => {
        return order.agency === 'NOT ASSIGN' ? (count += 1) : count;
      }, 0)
    );

    $('#compPending').text(
      orders.reduce((count, order) => {
        return order.isActive === false && !(order.reason === 'COMMISSIONED' || order.reason === 'CANCELLED') ? (count += 1) : count;
      }, 0)
    );
  }

  // Set dashboard counts finish

  if (role === 'NO' || role === 'ADMIN') {
    // Agency wise Order Chart
    // chartCreate(orders, 'isActive', true, 'agency', 'agency_orders', 'agency_ordersLegend', 'orders', 'agency=');
  }
  // Order Type wise Order Chart
  chartCreate(orders, 'isActive', true, 'orderType', 'orderType_orders', 'orderType_ordersLegend', 'orders', 'orderType=');
  // Reason wise Order Chart
  chartCreate(orders, 'isActive', true, 'reason', 'reason_orders', 'reason_ordersLegend', 'orders', 'reason=');
});

// $.get('/feasibilities/api?pending=ALL', (feasibilities) => {
//   $('#myFeasibilityPending').text(
//     feasibilities.reduce((count, feasibility) => {
//       return feasibility.pending ? (count += 1) : count;
//     }, 0)
//   );
//   if (role === 'NO' || role === 'ADMIN') {
//     // Agency wise Feasibility Chart
//     chartCreate(feasibilities, 'pending', true, 'agency', 'agency_feasibilities', 'agency_feasibilitiesLegend', 'feasibilities', 'agency=');
//   }
// });
