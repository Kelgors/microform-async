const wait = require('./wait');
function waitAndReturn(timeout) {
  return wait(timeout).then(() => timeout);
}
Promise.all([
  waitAndReturn(3000),
  waitAndReturn(5000),
  waitAndReturn(4000),
  waitAndReturn(1000)
])
  .then(function (result) {
    console.info('Toutes les Promise sont résolues\n%o', result);
  });
