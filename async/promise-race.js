const wait = require('./wait');
function waitAndReturn(timeout) {
  return wait(timeout).then(() => timeout);
}
Promise.race([
  waitAndReturn(3000),
  waitAndReturn(5000),
  waitAndReturn(4000),
  waitAndReturn(1000)
])
  .then(function (result) {
    console.info('Une Promise est résolues après %sms', result);
  });
