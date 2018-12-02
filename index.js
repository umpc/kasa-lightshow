const { Client } = require('tplink-smarthome-api');

const rand = (min, max) => Math.floor(min + Math.random()*(max + 1 - min));

const nextLightState = async (config, bulb) => {
  try {
    await bulb.lighting.setLightState({
      transition_period: config.nextState.transitionPeriod,
      on_off: 1,
      mode: 'normal',
      brightness: rand(
        config.brightness[0],
        config.brightness[1]
      ),
      hue: rand(
        config.hue[0],
        config.hue[1]
      ),
      saturation: rand(
        config.saturation[0],
        config.saturation[1]
      )
    });
  } catch (ex) {
    console.error(ex);
  }
};

(async function main() {
  try {
    const config = require('./config.json');

    const client = new Client();
    const bulb = await client.getDevice({ host: config.ip });

    await nextLightState(config, bulb);
    setInterval(() => nextLightState(config, bulb), config.nextState.interval);

  } catch (ex) {
    console.error(ex);
  }
})();
