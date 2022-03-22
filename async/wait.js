module.exports = function wait(timeout = 1000/60) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, timeout || 1);
  });
};
