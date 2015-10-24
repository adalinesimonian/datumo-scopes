/* global describe, it */
'use strict'

let expect = require('chai').expect

let testModels = require('./test-models')
let DatumoScopes = require('../lib/index')

describe('Scoped subsets', () => {
  describe('with a model with default actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should return a model with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset('person-read-overview')

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset('person-write-overview')

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should return a model with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-read-overview', 'person-read-email'
          ])

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-write-overview', 'person-write-email'
          ])

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should return a model with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-write-overview', 'write'
          )

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-read-overview', 'write'
          )

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should return a model with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-write-overview', 'person-write-email'
          ], 'write')

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-read-overview', 'person-read-email'
          ], 'write')

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with single scope, action, and properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the action for all allowed given properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-write-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-write-overview', 'write', ['email']
          )

          expect(Subset).to.be.undefined
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-read-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, an action, and properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the action for all allowed given properties', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-write-overview', 'person-write-email'
          ], 'write', ['middleName', 'email'])

          expect(Subset.schema).to.have.all.keys([
            'middleName', 'email'
          ])
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-write-overview', 'person-write-email'
          ], 'write', ['phone'])

          expect(Subset).to.be.undefined
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          let Person = testModels.createPersonModel()
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-read-overview', 'person-read-email'
          ], 'write', ['middleName', 'email'])

          expect(Subset).to.be.undefined
        })
      })
    })
  })
  describe('with a model with custom actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should return a model with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset('person-view-overview')

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset('person-edit-overview')

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should return a model with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-view-overview', 'person-view-email'
          ])

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-edit-overview', 'person-edit-email'
          ])

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should return a model with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-edit-overview', 'edit'
          )

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-view-overview', 'edit'
          )

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should return a model with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-edit-overview', 'person-edit-email'
          ], 'edit')

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'middleName', 'familyName', 'email'
          ])
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-view-overview', 'person-view-email'
          ], 'edit')

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with single scope, action, and properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the action for all allowed given properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-edit-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(Subset.schema).to.have.all.keys([
            'givenName', 'familyName'
          ])
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-edit-overview', 'edit', ['email']
          )

          expect(Subset).to.be.undefined
        })
      })
      describe('with insufficient scope', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset(
            'person-view-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(Subset).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, an action, and properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the action for all allowed given properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['middleName', 'email'])

          expect(Subset.schema).to.have.all.keys([
            'middleName', 'email'
          ])
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['phone'])

          expect(Subset).to.be.undefined
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return a model', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let personScopes = new DatumoScopes(Person)
          let Subset = personScopes.scopedSubset([
            'person-view-overview', 'person-view-email'
          ], 'edit', ['middleName', 'email'])

          expect(Subset).to.be.undefined
        })
      })
    })
  })
})
