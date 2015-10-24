'use strict'

let Datumo = require('datumo')

function createPersonModel () {
  return class Person extends Datumo.Model {
    static get modelName () { return 'person' }

    static get schema () {
      return {
        givenName: {
          type: 'string',
          required: true
        },
        middleName: {
          type: 'string'
        },
        familyName: {
          type: 'string',
          required: true
        },
        email: {
          type: 'string',
          format: 'email'
        },
        phone: {
          type: 'string'
        }
      }
    }

    static get propertySets () {
      return {
        all: '*',
        overview: ['givenName', 'middleName', 'familyName'],
        email: ['email']
      }
    }
  }
}

module.exports = {
  createPersonModel
}
