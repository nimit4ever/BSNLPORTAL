$.get('/orders/api', (orders) => {
  // Set dashboard counts Start
  const role = $('#role').text();

  $('#myPending').text(
    orders.reduce((count, order) => {
      return order[role] === false ? (count += 1) : count;
    }, 0)
  );

  $('#totalPending').text(
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
  // Set dashboard counts finish

  // Set new default font family and font color to mimic Bootstrap's default styling
  (Chart.defaults.global.defaultFontFamily = 'Nunito'),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  // Order Type wise Chart Start
  const orderType = orders.reduce((tally, order) => {
    if (order.isActive) tally[order.orderType] = (tally[order.orderType] || 0) + 1;
    return tally;
  }, {});

  const orderTypeKey = Object.keys(orderType);
  const orderTypeValue = orderTypeKey.map((key) => {
    return orderType[key];
  });

  const orderTypeChart = new Chart(document.getElementById('orderTypeChart'), {
    type: 'doughnut',
    data: {
      labels: orderTypeKey,
      datasets: [
        {
          data: orderTypeValue,
          backgroundColor: ['#1cc88a', '#e74a3b', '#4e73df', '#f6c23e', '#858796', '#36b9cc'],
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
        display: true,
        position: 'bottom',
      },
      cutoutPercentage: 75,
    },
  });

  document.getElementById('orderTypeChart').onclick = function (evt) {
    const activePoints = orderTypeChart.getElementsAtEventForMode(evt, 'point', orderTypeChart.options);
    const firstPoint = activePoints[0];
    const label = orderTypeChart.data.labels[firstPoint._index];
    window.location.href = `${window.location.origin}/orders?orderType=${label}&isActive=1`;
  };
  // Order Type wise Chart finish

  // Agency wise Chart Start
  const agency = orders.reduce((tally, order) => {
    if (order.isActive) tally[order.agency] = (tally[order.agency] || 0) + 1;
    return tally;
  }, {});

  const agencyKey = Object.keys(agency);
  const agencyValue = agencyKey.map((key) => {
    return agency[key];
  });

  const agencyChart = new Chart(document.getElementById('agencyChart'), {
    type: 'doughnut',
    data: {
      labels: agencyKey,
      datasets: [
        {
          data: agencyValue,
          backgroundColor: [
            '#1cc88a',
            '#e74a3b',
            '#4e73df',
            '#f6c23e',
            '#858796',
            '#36b9cc',
            '#1cc88a',
            '#e74a3b',
            '#4e73df',
            '#f6c23e',
            '#858796',
            '#36b9cc',
          ],
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
        display: true,
        position: 'bottom',
      },
      cutoutPercentage: 75,
    },
  });

  document.getElementById('agencyChart').onclick = function (evt) {
    const activePoints = agencyChart.getElementsAtEventForMode(evt, 'point', agencyChart.options);
    const firstPoint = activePoints[0];
    const label = agencyChart.data.labels[firstPoint._index];
    window.location.href = `${window.location.origin}/orders?agency=${label}&isActive=1`;
  };
  // Agency wise Chart finish

  // Reason wise Chart Start
  const reason = orders.reduce((tally, order) => {
    if (order.isActive) tally[order.reason] = (tally[order.reason] || 0) + 1;
    return tally;
  }, {});

  const reasonKey = Object.keys(reason);
  const reasonValue = reasonKey.map((key) => {
    return reason[key];
  });

  const reasonChart = new Chart(document.getElementById('reasonChart'), {
    type: 'doughnut',
    data: {
      labels: reasonKey,
      datasets: [
        {
          data: reasonValue,
          backgroundColor: [
            '#1cc88a',
            '#e74a3b',
            '#4e73df',
            '#f6c23e',
            '#858796',
            '#36b9cc',
            '#1cc88a',
            '#e74a3b',
            '#4e73df',
            '#f6c23e',
            '#858796',
            '#36b9cc',
          ],
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
        display: true,
        position: 'bottom',
      },
      cutoutPercentage: 75,
    },
  });

  document.getElementById('reasonChart').onclick = function (evt) {
    const activePoints = reasonChart.getElementsAtEventForMode(evt, 'point', reasonChart.options);
    const firstPoint = activePoints[0];
    const label = reasonChart.data.labels[firstPoint._index];
    window.location.href = `${window.location.origin}/orders?reason=${label}&isActive=1`;
  };
  // Reason wise Chart finish
});
