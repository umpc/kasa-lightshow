const { randNumFromRanges } = require('./rand-num');

const isHueSimilar = function (config, lightState, options) {
  return Math.abs(lightState.hue - options.hue) < config.minHueDifference &&
    (options.hue !== config.hue[0] || options.hue !== config.hue[1]);
};

const nextLightState = function (config, bulb, lightState) {
  const options = {
    on_off: 1,
    color_temp: 0,
    mode: 'normal',
    hue: randNumFromRanges(config.hue),
    saturation: randNumFromRanges(config.saturation),
    brightness: randNumFromRanges(config.brightness),
    transition_period: config.nextState.transitionPeriod * 1000
  };
  if (lightState) {
    if (isHueSimilar(config, lightState, options)) {
      return nextLightState(config, bulb, lightState);
    }
  }
  bulb.lighting.setLightState(options);
  return options;
};

module.exports = {
  startTransitions: function (config, bulb) {
    let lightState = nextLightState(config, bulb);
    setInterval(
      function () { lightState = nextLightState(config, bulb, lightState); },
      config.nextState.interval * 1000
    );
  }
};