const wait = require('./wait');
wait(1000)
    .then(function () {
        console.info('Etape 1');
        return wait(1000)
            .then(function () {
                throw new Error('Oupsy, une erreur !');
            });
    })
    .then(function () {
      console.info('Etape 2');
      return 'Etape 3';
    })
    .catch(function () {
        console.warn('Une erreur possible a été supportée');
        return 'Etape avec erreur'; // je retourne une valeur par défaut
    })
    .then(function (result) {
        console.info('Youpi ! "%s" a été atteinte avec succès', result);
    })
    .catch(function (err) {
      console.error('Mince, %s', err);
    });

