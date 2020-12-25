const axios = require('axios');
const qs = require('qs');
const htmlTableToJson = require('html-table-to-json');

module.exports = async (area) => {
  const totalOrder = [];
  const configGet = {
    method: 'get',
    url: 'http://10.202.208.201:8080/LCPendingOrderReport/LCPendingOrderClass.do',
  };

  await axios(configGet)
    .then(async function (request, response) {
      cookie = request.headers['set-cookie'][0].split(';')[0];
      const data = qs.stringify({
        selectedSSA: area,
        selectedWorkgroup: 'All Workgroups',
      });
      const configPost = {
        method: 'post',
        url: 'http://10.202.208.201:8080/LCPendingOrderReport/ReportDisplayController.do',
        headers: {
          Connection: 'keep-alive',
          'Cache-Control': 'max-age=0',
          'Upgrade-Insecure-Requests': '1',
          Origin: 'http://10.202.208.201:8080',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          Referer: 'http://10.202.208.201:8080/LCPendingOrderReport/LCPendingOrderClass.do?',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8,gu;q=0.7',
          Cookie: cookie,
        },
        data: data,
      };

      await axios(configPost)
        .then(function (response) {
          const rowdata = new htmlTableToJson(response.data);

          for (order of rowdata._results[0]) {
            if (order.SERVICE_TYPE === 'LEASED_LINE' && (order.ENDA_SSA === area || order.ENDB_SSA === area)) {
              totalOrder.push(order);
            }
          }
        })
        .catch(function (error) {
          console.log(error.message);
        });
    })
    .catch(function (error) {
      console.log(error.message);
    });
  return totalOrder;
};
