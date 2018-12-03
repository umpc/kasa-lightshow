const { Client } = require('tplink-smarthome-api');
const { startTransitions } = require('./transitions');

(function main() {
  const config = require('./config.json');
  new Client().getDevice({ host: config.ip })
    .then(function (bulb) { startTransitions(config, bulb); })
    .catch(console.error);
})();