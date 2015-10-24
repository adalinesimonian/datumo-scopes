/* global describe, it */
'use strict'

let expect = require('chai').expect

let testModels = require('./test-models')
let DatumoScopes = require('../lib/index')

describe('Scope enumeration', () => {
  describe('with default actions', () => {
    it('should enumerate all valid scopes', () => {
      let Person = testModels.createPersonModel()
      let scopes = new DatumoScopes(Person).getScopes()

      expect(scopes).to.have.length(6)
      expect(scopes).to.have.members([
        'person-read-all',
        'person-write-all',
        'person-read-overview',
        'person-write-overview',
        'person-read-email',
        'person-write-email'
      ])
    })
  })
  describe('with custom actions', () => {
    it('should enumerate all valid scopes', () => {
      class Person extends testModels.createPersonModel() {
        static get actions () {
          return ['view', 'edit', 'update']
        }
      }
      let scopes = new DatumoScopes(Person).getScopes()

      expect(scopes).to.have.length(9)
      expect(scopes).to.have.members([
        'person-view-all',
        'person-edit-all',
        'person-update-all',
        'person-view-overview',
        'person-edit-overview',
        'person-update-overview',
        'person-view-email',
        'person-edit-email',
        'person-update-email'
      ])
    })
  })
})
