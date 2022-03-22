const wait = require('./wait');
'use strict';

(async function () {
    try {
        await wait(1000);

        console.info('Etape 1');
        await wait(1000);
        throw new Error('Oupsy, une erreur !');

        console.info('Etape 2');
        const result = 'Etape 3';

        console.info('Youpi ! "%s" a été atteinte avec succès', result);
     } catch (err) {
        console.error('Mince, %s', err);
     }
})();
