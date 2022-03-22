function wait(timeout) {
  if (!timeout) return Promise.resolve();
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
wait().then(function () {
  console.info('instantané');
});
