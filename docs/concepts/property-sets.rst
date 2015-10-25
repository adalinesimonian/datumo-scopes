Property sets
=============

Property sets are groups of properties used to describe what properties a scope
grants access to.

They are defined by setting the static ``propertySets`` property on the model to
an object where the keys are the property set names, and the values describe the
properties they apply to.

A property set can be defined by:

- An array of strings, where each string is the name of a property on the model
- ``'*'``, which means that the property set includes all the model's properties

Example
-------

::

  class Person extends Datumo.Model {
    static get schema () {
      return {
        givenName: { type: 'string', required: true },
        middleName: { type: 'string' },
        familyName: { type: 'string', required: true },
        email: { type: 'string', format: 'email' }
      }
    }

    static get propertySets () {
      return {
        all: '*',
        name: ['givenName', 'middleName', 'familyName'],
        email: ['email']
      }
    }
  }
