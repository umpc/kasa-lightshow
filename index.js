const { Client } = require('tplink-smarthome-api');

const rand = function (min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min));
};

const nextLightState = function (config, bulb) {
  return bulb.lighting.setLightState({
    on_off: 1,
    color_temp: 0,
    mode: 'normal',
    hue: rand(config.hue[0], config.hue[1]),
    saturation: rand(config.saturation[0], config.saturation[1]),
    brightness: rand(config.brightness[0], config.brightness[1]),
    transition_period: config.nextState.transitionPeriod
  });
};

(function main() {
  const config = require('./config.json');
  new Client().getDevice({ host: config.ip })
    .then(function (bulb) {
      nextLightState(config, bulb);
      setInterval(
        function () { nextLightState(config, bulb); },
        config.nextState.interval
      );
    })
    .catch(console.error);
})();