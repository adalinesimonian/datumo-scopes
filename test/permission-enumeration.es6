/* global describe, it */
'use strict'

let expect = require('chai').expect

let testModels = require('./test-models')
let DatumoScopes = require('../lib/index')

describe('Permission enumeration', () => {
  describe('without any given action', () => {
    describe('with a single scope', () => {
      it('should enumerate all permissions implied by the scope', () => {
        let Person = testModels.createPersonModel()
        let personScopes = new DatumoScopes(Person)
        let permissions = personScopes.getPermissions('person-read-overview')

        expect(permissions).to.have.length(1)
        expect(permissions).to.deep.have.members([
          {
            action: 'read',
            properties: ['givenName', 'middleName', 'familyName']
          }
        ])
      })
    })
    describe('with multiple scopes', () => {
      it('should enumerate all permissions implied by the scopes', () => {
        let Person = testModels.createPersonModel()
        let personScopes = new DatumoScopes(Person)
        let permissions = personScopes.getPermissions([
          'person-read-overview', 'person-write-email'
        ])

        expect(permissions).to.have.length(2)
        expect(permissions).to.deep.have.members([
          {
            action: 'read',
            properties: ['givenName', 'middleName', 'familyName']
          },
          {
            action: 'write',
            properties: ['email']
          }
        ])
      })
    })
  })
  describe('with a given action', () => {
    describe('with a single scope', () => {
      it('should enumerate all permissions implied by the scope and action', () => {
        let Person = testModels.createPersonModel()
        let personScopes = new DatumoScopes(Person)
        let permissions = personScopes.getPermissions('person-read-all', 'read')

        expect(permissions).to.have.length(1)
        expect(permissions).to.deep.have.members([
          {
            action: 'read',
            properties: ['givenName', 'middleName', 'familyName', 'email', 'phone']
          }
        ])
      })
      it('should not enumerate permissions for different actions', () => {
        let Person = testModels.createPersonModel()
        let personScopes = new DatumoScopes(Person)
        let permissions = personScopes.getPermissions('person-read-overview', 'write')

        expect(permissions).to.have.length(0)
      })
    })
    describe('with multiple scopes', () => {
      it('should enumerate all permissions implied by the scopes and action', () => {
        let Person = testModels.createPersonModel()
        let personScopes = new DatumoScopes(Person)
        let permissions = personScopes.getPermissions([
          'person-read-overview', 'person-write-email'
        ], 'write')

        expect(permissions).to.have.length(1)
        expect(permissions).to.deep.have.members([
          {
            action: 'write',
            properties: ['email']
          }
        ])
      })
    })
  })
})
