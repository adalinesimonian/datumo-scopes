# datumo-scopes

[![Build Status](https://travis-ci.org/vsimonian/datumo-scopes.svg?branch=master)](https://travis-ci.org/vsimonian/datumo-scopes)

datumo-scopes is an opinionated library that helps you control access to data on
[Datumo][datumo] models on a per-property basis using scopes.

## Example Usage

**Datumo requires Node.js 4.0 or later.**

```
$ npm install --save datumo-scopes datumo
```

```javascript
let Datumo = require('datumo')
let DatumoScopes = require('datumo-scopes')

class Person extends Datumo.Model {
  static get schema () {
    return {
      id: { type: 'integer', minimum: 0, required: true },
      givenName: { type: 'string', required: true },
      middleName: { type: 'string' },
      familyName: { type: 'string', required: true },
      email: { type: 'string', format: 'email' }
    }
  }

  static get propertySets () {
    return {
      name: ['givenName', 'middleName', 'familyName'],
      email: ['email']
    }
  }
}

static getByID (id) {
  // ...
}

let personScopes = new DatumoScopes(Person)

// ...

server.get('/person/:id', (req, res, next) => {
  Person.getByID(req.params.id).then(person => {
    let filteredPerson = personScopes.filter(person, req.user.scopes)
    res.send(filteredPerson)
  }).catch(err => next(err))
})

// Data:
// {
//   id: 12345,
//   givenName: 'Amanda',
//   familyName: 'Bryson',
//   email: 'amanda@example.com'
// }

// Request:
// req.user.scopes === ['Person-read-name']
// GET /person/12345

// Response:
// {
//   givenName: 'Amanda',
//   familyName: 'Bryson'
// }
```

## License

MIT

[datumo]: https://github.com/vsimonian/datumo
