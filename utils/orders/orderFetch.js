const axios = require('axios');
const qs = require('qs');

const { Order } = require('../../models/orders');

async function orderFetch(orderId) {
  const order = await Order.findOne({ orderId });
  if (!order || !order.isActive) {
    throw 'Please enter active and valid Order ID';
  } else {
    const configGet = {
      method: 'get',
      url: 'http://10.202.208.201:8080/TelephoneDetailsReport/InvoiceSwitchClass.do?',
    };

    const orderValue = await axios(configGet)
      .then(async function (request, response) {
        cookie = request.headers['set-cookie'][0].split(';')[0];
        const data = qs.stringify({
          selectedId: order.orderId,
        });
        const configPost = {
          method: 'post',
          url: 'http://10.202.208.201:8080/TelephoneDetailsReport/ReportDisplayController.do',
          headers: {
            Connection: 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            Origin: 'http://10.202.208.201:8080',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            Referer: 'http://10.202.208.201:8080/TelephoneDetailsReport/InvoiceSwitchClass.do?',
            'Accept-Language': 'en-US,en;q=0.9',
            Cookie: cookie,
          },
          data: data,
        };

        const orderValue = await axios(configPost)
          .then(async function (response) {
            return response.data;
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'file.pdf');
            // document.body.appendChild(link);
            // link.click();
          })
          .catch(function (error) {
            throw error;
          });
        return orderValue;
      })
      .catch(function (error) {
        console.log(error.message);
        throw 'Can not connect to the server, please try later';
      });
    return orderValue;
  }
  return orderValue;
}

module.exports = { orderFetch };
