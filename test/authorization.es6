/* global describe, it */
'use strict'

let expect = require('chai').expect

let testModels = require('./test-models')
let DatumoScopes = require('../lib/index')

describe('Authorization', () => {
  describe('with a model with default actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize a read action for all applicable properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize('person-read-overview')

          expect(authorizedProperties).to.have.length(3)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize a read action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize('person-write-overview')

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize a read action for all applicable properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-read-overview', 'person-read-email'
          ])

          expect(authorizedProperties).to.have.length(4)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize a read action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-write-overview', 'person-write-email'
          ])

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the given action for all applicable properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-write-overview', 'write'
          )

          expect(authorizedProperties).to.have.length(3)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-read-overview', 'write'
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the given action for all applicable properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-write-overview', 'person-write-email'
          ], 'write')

          expect(authorizedProperties).to.have.length(4)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-read-overview', 'person-read-email'
          ], 'write')

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with single scope, action, and properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the action for all applicable given properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-write-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(authorizedProperties).to.have.length(2)
          expect(authorizedProperties).to.have.members([
            'givenName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-write-overview', 'write', ['email']
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-read-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes, an action, and properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the action for all applicable given properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-write-overview', 'person-write-email'
          ], 'write', ['middleName', 'email'])

          expect(authorizedProperties).to.have.length(2)
          expect(authorizedProperties).to.have.members([
            'middleName', 'email'
          ])
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-write-overview', 'person-write-email'
          ], 'write', ['phone'])

          expect(authorizedProperties).to.have.length(0)
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize the given action', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-read-overview', 'person-read-email'
          ], 'write', ['middleName', 'email'])

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
  })
  describe('with a model with custom actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the default action for all applicable properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize('person-view-overview')

          expect(authorizedProperties).to.have.length(3)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize the default action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize('person-edit-overview')

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the default action for all applicable properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-view-overview', 'person-view-email'
          ])

          expect(authorizedProperties).to.have.length(4)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize the default action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-edit-overview', 'person-edit-email'
          ])

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the given action for all applicable properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-edit-overview', 'edit'
          )

          expect(authorizedProperties).to.have.length(3)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-view-overview', 'edit'
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the given action for all applicable properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-edit-overview', 'person-edit-email'
          ], 'edit')

          expect(authorizedProperties).to.have.length(4)
          expect(authorizedProperties).to.have.members([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-view-overview', 'person-view-email'
          ], 'edit')

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with single scope, action, and properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the action for all applicable given properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-edit-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(authorizedProperties).to.have.length(2)
          expect(authorizedProperties).to.have.members([
            'givenName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-edit-overview', 'edit', ['email']
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
      describe('with insufficient scope', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize(
            'person-view-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
    describe('with multiple scopes, an action, and properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the action for all applicable given properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['middleName', 'email'])

          expect(authorizedProperties).to.have.length(2)
          expect(authorizedProperties).to.have.members([
            'middleName', 'email'
          ])
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['phone'])

          expect(authorizedProperties).to.have.length(0)
        })
      })
      describe('with insufficient scopes', () => {
        it('should not authorize the given action', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let authorizedProperties = personScopes.authorize([
            'person-view-overview', 'person-view-email'
          ], 'edit', ['middleName', 'email'])

          expect(authorizedProperties).to.have.length(0)
        })
      })
    })
  })
})
