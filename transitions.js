const { randNumFromRanges } = require('./rand-num.js');
const readdirp = require('readdirp');
const Canvas = require('canvas');
const palette = require('palette');
const convert = require('color-convert');

const isHueSimilar = function (config, lightState, options) {
  return Math.abs(lightState.hue - options.hue) < config.minHueDifference &&
    (options.hue !== config.hue[0] || options.hue !== config.hue[1]);
};

const nextLightState = function (config, bulb, lightState, pixel) {
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
  bulb.lighting.setLightState(options).catch(console.error);
  return options;
};

module.exports = {
  startTransitions: function (config, bulb) {
    if (config.image) {
      if (!config.image.sources || !config.image.sources.length) {
        throw new Error('no image sources have been configured');
      }
      config.image.sources.forEach(function (source) {
        if ('directory' in source) {
          readdirp({
            root: source.directory,
            fileFilter: source.fileFilter,
            directoryFilter: source.directoryFilter,
            depth: source.depth,
            entryType: source.entryType
          })
          .on('warn', console.warn)
          .on('error', console.error)
          .on('data', function (entry) {
            const img = new Canvas.Image;

            img.onload = function () {
              const canvas = new Canvas;
              const ctx = canvas.getContext('2d');

              canvas.width = img.width;
              canvas.height = img.height;

              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);

              const rgbColors = palette(canvas, source.samples);
              rgbColors.forEach(function(rgbColor) {
                const r = rgbColor[0];
                const g = rgbColor[1];
                const b = rgbColor[2];

                const hsvColor = convert.rgb.hsv(r, g, b);

                config.hue.push([ hsvColor[0], hsvColor[0] ]);
                config.saturation.push([ hsvColor[1], hsvColor[1] ]);
                config.brightness.push([ hsvColor[2], hsvColor[2] ]);
              });
            };

            img.src = entry.fullPath;
          })
          .on('end', function () {
            let lightState = nextLightState(config, bulb);
            setInterval(
              function () { lightState = nextLightState(config, bulb, lightState); },
              config.nextState.interval * 1000
            );
          });
        }
      });
    } else {
      let lightState = nextLightState(config, bulb);
      setInterval(
        function () { lightState = nextLightState(config, bulb, lightState); },
        config.nextState.interval * 1000
      );
    }
  }
};