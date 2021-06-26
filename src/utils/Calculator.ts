function getHoursBySeconds(seconds: number) {
  return (seconds / 60 / 60).toFixed(1);
}

const Calculator = {
  getHoursBySeconds,
};

export default Calculator;
