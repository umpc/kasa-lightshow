const randNum = function (min, max) {
  return Math.min(max,
    Math.max(min,
      Math.round(min + Math.random() * (max + 1 - min))
    )
  );
};

module.exports = {
  randNumFromRanges: function (ranges) {
    if (ranges.length) {
      const randNumsFromRanges = ranges.map(function (range) {
        return randNum(range[0], range[1]);
      });

      const randIdx = randNum(0, randNumsFromRanges.length - 1);
      return randNumsFromRanges[randIdx];
    }
  }
};