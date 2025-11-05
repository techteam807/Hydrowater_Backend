function getISTDate() {
  const now = new Date();
  // get UTC time in ms + offset for IST (UTC +5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}
module.exports = {
  getISTDate,
};