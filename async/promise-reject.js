function wait(timeout) {
  if (!timeout) return Promise.reject('Missing argument timeout');
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
wait()
  .then(function () {
    console.info('instantanĂ©');
  })
  .catch(function (err) {
    console.error(err);
  });
