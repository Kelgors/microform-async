# Asynchrone en Javascript

## Historique

### Waterfalling

```javascript
function getText(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onerror = function onXhrError(err) {
    callback(err);
  };
  xhr.onloadend = function onXhrLoadEnd() {
    callback(null, xhr.responseText);
  };
  xhr.open('GET', url, true);
  xhr.send();
}

function getJson(url, callback) {
  return getText(url, function (err, data) {
    if (err) callback(err);
    else callback(null, JSON.parse(data));
  });
}

getJson('/data.json', function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  getJson(data.next, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    getJson(data.next, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
  	  display(result);
    });
  });
});
```

### Ajout de Promise

```javascript
function getText(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onloadend = function onXhrLoadEnd() {
      resolve(xhr.responseText);
    };
    xhr.open('GET', url, true);
    xhr.send();
  });
}

function getJson(url) {
  return getText(url).then(JSON.parse);
}

getJson('/data.json')
  .then(function (data) {
    return getJson(data.next);
  })
  .then(function (data) {
    return getJson(data.next);
  })
  .then(function (result) {
    display(result);
  })
  .catch(function (err) {
    console.error(err);
  });
```

### Ajout du async/await

```javascript
function getText(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onloadend = function onXhrLoadEnd() {
      resolve(xhr.responseText);
    };
    xhr.open('GET', url, true);
    xhr.send();
  });
}

function getJson(url) {
  return getText(url).then(JSON.parse);
}

async function getData() {
  try {
    const data1 = await getJson('/data.json');
    const data2 = await getJson(data1.next);
    return getJson(data2.next);
  } catch (err) {
    console.error(err);
  }
}

getData().then(function (result) {
  display(result);
});
```

## Les méthodes

### Promise#then()

Le callback de Promise#then() peut recevoir une Promise en retour, de ce fait le flow d'éxecution va attendre qu'elle soit résolue pour continuer.
On peut aussi retourner n'importe quelle autre valeur, les callbacks de then s'enchainent alors sans attendre quoi que ce soit d'autre.

```javascript
const wait = require('./wait');
wait(1000)
    .then(function () {
        console.info('Etape 1');
        return wait(1000);
    })
    .then(function () {
      console.info('Etape 2');
      return 'Etape 3';
    })
    .then(function (result) {
        console.info('Youpi ! "%s" a été atteinte avec succès', result);
    });
```

### Promise#catch()

Le catch est executé dans l'ordre d'apparition. Lorsqu'un catch est appelé, la Promise passe de 'rejected' à 'resolved' et continuera d'appeler les Promise#then suivants.

```javascript
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
    .then(function (result) {
        console.info('Youpi ! "%s" a été atteinte avec succès', result);
    })
    .catch(function (err) {
      console.error('Mince, %s', err);
    });
```

La même chose en utilisant le keyword async:

```javascript
const wait = require('./wait');
'use strict';

(async function () {
    function wait(timeout = 1000/60) {
      return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
      });
    }

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

```

Et maintenant plusieurs Promise#catch():

```javascript
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
```

### Promise#all()

```javascript
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
```

### Promise#race()

```javascript
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
```

### Promise#resolve()

```javascript
function wait(timeout) {
  if (!timeout) return Promise.resolve();
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
wait().then(function () {
  console.info('instantané');  
});
```

### Promise#reject()

```javascript
function wait(timeout) {
  if (!timeout) return Promise.reject('Missing argument timeout');
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
wait()
  .then(function () {
    console.info('instantané');
  })
  .catch(function (err) {
    console.error(err);
  });
```

## Lisibilité

```javascript
(async function () {
  const queryUser = Promise.resolve({ email: 'jean-denis.denis@gmail.com', lastName: 'DENIS', firstName: 'Jean-Denis' });
  
  console.info(`${(await queryUser).email} ${(await queryUser).lastName} ${(await queryUser).firstName}`);

  /*const user = await queryUser;
  console.info(`${user.email} ${user.lastName} ${user.firstName}`);*/
})();
```

```typescript
async function createNotificationEtablissement(
  users: User[],
  etablissement: Etablissement,
  sub?: TokenPayload
): Promise<void> {
  const repoNotificationDesc = getRepository(NotificationDescription)
  const notifDesc = await repoNotificationDesc.save(
    Object.assign(new NotificationDescription(), {
      titre: 'Etablissement créé',
      description1: `${etablissement.nom}
        - ${(await etablissement.type).nom}
        - ${(await etablissement.adresse).ville} (${(await etablissement.adresse).codePostal})`,
      description2: `par ${(await (await etablissement.document)?.lastUpdater)?.prenom}
      ${(await (await etablissement.document)?.lastUpdater)?.nom} 
      - ${(await (await (await etablissement.document)?.lastUpdater)?.profil)?.entiteRattachement}`,
      type: NotificationType.INFORMATION,
      lien: '/etablissements/' + etablissement.id
    })
  )
  await this.generateNotifByDesc(notifDesc, users)
  await this.sendNotifByEmail(notifDesc, users, sub?.email)
}
```
