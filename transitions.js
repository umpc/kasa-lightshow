const { randNum } = require('./utils');

const nextLightState = function (config, bulb) {
  return bulb.lighting.setLightState({
    on_off: 1,
    color_temp: 0,
    mode: 'normal',
    hue: randNum(config.hue[0], config.hue[1]),
    saturation: randNum(config.saturation[0], config.saturation[1]),
    brightness: randNum(config.brightness[0], config.brightness[1]),
    transition_period: config.nextState.transitionPeriod * 1000
  });
};

module.exports = {
  startTransitions: function (config, bulb) {
    nextLightState(config, bulb);
    setInterval(
      function () { nextLightState(config, bulb); },
      config.nextState.interval * 1000
    );
  }
};