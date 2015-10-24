/* global Symbol */

'use strict'

import { Model } from 'datumo'

const model_ = Symbol()

function getActions (model) {
  if (!Array.isArray(model.actions)) {
    return ['read', 'write']
  } else {
    return model.actions.map(a => typeof a === 'string' ? a : (a && a.action))
  }
}

function getDefaultAction (model) {
  if (!Array.isArray(model.actions)) {
    return 'read'
  } else {
    let action = model.actions.find(a =>
      (a && typeof a === 'object') ? a.default : false
    )
    if (action) {
      return action.action
    } else {
      return model.actions[0]
    }
  }
}

export default class DatumoScopes {
  constructor (model) {
    if (!model || !model.prototype) {
      throw new Error('Model must be a class')
    }
    if (!(model.prototype instanceof Model)) {
      throw new Error('Model class must extend the Datumo Model class')
    }
    this[model_] = model
  }

  getScopes () {
    let actions = getActions(this[model_])
    return [].concat(...Object.keys(this[model_].propertySets).map(scope =>
        actions.map(action =>
          `${this[model_].modelName}-${action}-${scope}`
        )
      )
    )
  }

  getPermissions (scopes, action) {
    let actions = getActions(this[model_])
    if (!Array.isArray(scopes)) {
      scopes = [scopes]
    }
    if (scopes.some(scope => typeof scope !== 'string')) {
      throw new Error('Scopes must be a string or an array of strings')
    }
    if (!this[model_].propertySets) {
      throw new Error('Property sets not defined on model')
    }
    let permissions = []
    let propertySets = Object.keys(this[model_].propertySets)
    scopes.forEach(scope => {
      let scopeParts = scope.split('-')
      if (scopeParts.length < 3) { return }
      if (scopeParts[0] !== this[model_].modelName) { return }
      if (actions.indexOf(scopeParts[1]) === -1) { return }
      if (action && scopeParts[1] !== action) { return }
      let setName = scope.substr(scopeParts[0].length + scopeParts[1].length + 2)
      if (propertySets.find(propertySet => propertySet === setName)) {
        let permission = permissions.find(p => p.action === scopeParts[1])
        if (permission) {
          this[model_].propertySets[setName].forEach(property => {
            if (permission.properties.indexOf(property) === -1) {
              permission.properties.push(property)
            }
          })
        } else {
          permissions.push({
            action: scopeParts[1],
            properties: this[model_].propertySets[setName]
          })
        }
      }
    })
    return permissions
  }

  authorize (scopes, action, properties = []) {
    if (!action) { action = getDefaultAction(this[model_]) }
    if (!Array.isArray(properties)) {
      properties = [properties]
    }
    let permissions = this.getPermissions(scopes, action)
    let permission = permissions.find(p => p.action === action)
    if (permission) {
      if (properties.length > 0) {
        return permission.properties.filter(p => properties.indexOf(p) !== -1)
      } else {
        return permission.properties
      }
    } else {
      return []
    }
  }

  scopedSubset (scopes, action, properties = []) {
    let allowedProperties = this.authorize(scopes, action, properties)
    if (allowedProperties.length > 0) {
      return this[model_].subset(...allowedProperties)
    } else {
      return undefined
    }
  }

  filter (data, scopes, action, properties) {
    let Subset = this.scopedSubset(scopes, action, properties)
    if (Subset) {
      return new Subset(data)
    } else {
      return undefined
    }
  }
}
