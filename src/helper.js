export const getRandPosition = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`
});

export const pickRandomType = obj => {
  let result;
  let count = 0;
  for (var prop in obj) if (Math.random() < 1 / ++count) result = obj[prop];
  return result;
};

export const callWithIncreasingFrequency = (
  interval,
  frequencyChange,
  callback
) => {
  interval += frequencyChange;
  if (interval >= 0.5)
    setTimeout(() => {
      callback();
      callWithIncreasingFrequency(interval, frequencyChange, callback);
    }, interval);
};

export const getFrequencyChange = (startInterval, endInterval, duration) => {
  const numberOfIterations = 2 * duration / (startInterval + endInterval);
  const frequencyChange = (startInterval - endInterval) / numberOfIterations;
  return frequencyChange * -1;
};

export const getRandomInRange = (from, to) =>
  Math.ceil(Math.random() * from) + to - from;

export const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const getRemainingSec = (start, length) => {
  const elapsedMs = new Date() - start;
  const elapsed = Math.round(elapsedMs / 1000);
  const remaining = length - elapsed;
  return remaining;
};
