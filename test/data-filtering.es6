/* global describe, it */
'use strict'

let expect = require('chai').expect

let testModels = require('./test-models')
let DatumoScopes = require('../lib/index')

describe('Data filtering', () => {
  describe('with a model with default actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should return an object with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, 'person-read-overview')

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, 'person-write-overview')

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should return an object with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-read-overview', 'person-read-email'
          ])

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-write-overview', 'person-write-email'
          ])

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should return an object with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-write-overview', 'write'
          )

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-read-overview', 'write'
          )

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should return an object with all allowed properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-write-overview', 'person-write-email'
          ], 'write')

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-read-overview', 'person-read-email'
          ], 'write')

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with single scope, action, and properties', () => {
      describe('with sufficient scope', () => {
        it('should authorize the action for all allowed given properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-write-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-write-overview', 'write', ['email']
          )

          expect(filteredPerson).to.be.undefined
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-read-overview', 'write', ['givenName', 'familyName', 'email']
          )

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, an action, and properties', () => {
      describe('with sufficient scopes', () => {
        it('should authorize the action for all allowed given properties', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-write-overview', 'person-write-email'
          ], 'write', ['middleName', 'email'])

          expect(filteredPerson).to.eql({
            middleName: 'Abbott',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-write-overview', 'person-write-email'
          ], 'write', ['phone'])

          expect(filteredPerson).to.be.undefined
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          let Person = testModels.createPersonModel()
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-read-overview', 'person-read-email'
          ], 'write', ['middleName', 'email'])

          expect(filteredPerson).to.be.undefined
        })
      })
    })
  })
  describe('with a model with custom actions', () => {
    describe('with single scope, no given action or properties', () => {
      describe('with sufficient scope', () => {
        it('should return an object with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, 'person-view-overview')

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, 'person-edit-overview')

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with multiple scopes, no given action or properties', () => {
      describe('with sufficient scopes', () => {
        it('should return an object with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-view-overview', 'person-view-email'
          ])

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-edit-overview', 'person-edit-email'
          ])

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with single scope and action, no given properties', () => {
      describe('with sufficient scope', () => {
        it('should return an object with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-edit-overview', 'edit'
          )

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-view-overview', 'edit'
          )

          expect(filteredPerson).to.be.undefined
        })
      })
    })
    describe('with multiple scopes and an action, no given properties', () => {
      describe('with sufficient scopes', () => {
        it('should return an object with all allowed properties', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-edit-overview', 'person-edit-email'
          ], 'edit')

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-view-overview', 'person-view-email'
          ], 'edit')

          expect(filteredPerson).to.be.undefined
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
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-edit-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(filteredPerson).to.eql({
            givenName: 'Jane',
            familyName: 'Doe'
          })
        })
      })
      describe('with insufficient scope for any of the given properties', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-edit-overview', 'edit', ['email']
          )

          expect(filteredPerson).to.be.undefined
        })
      })
      describe('with insufficient scope', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person,
            'person-view-overview', 'edit', ['givenName', 'familyName', 'email']
          )

          expect(filteredPerson).to.be.undefined
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
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['middleName', 'email'])

          expect(filteredPerson).to.eql({
            middleName: 'Abbott',
            email: 'jane.doe@example.com'
          })
        })
      })
      describe('with insufficient scopes for any of the given properties', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-edit-overview', 'person-edit-email'
          ], 'edit', ['phone'])

          expect(filteredPerson).to.be.undefined
        })
      })
      describe('with insufficient scopes', () => {
        it('should not return an object', () => {
          class Person extends testModels.createPersonModel() {
            static get actions () {
              return [{ action: 'view', default: true }, 'edit']
            }
          }
          let person = new Person({
            givenName: 'Jane',
            middleName: 'Abbott',
            familyName: 'Doe',
            email: 'jane.doe@example.com'
          })
          let personScopes = new DatumoScopes(Person)
          let filteredPerson = personScopes.filter(person, [
            'person-view-overview', 'person-view-email'
          ], 'edit', ['middleName', 'email'])

          expect(filteredPerson).to.be.undefined
        })
      })
    })
  })
})
