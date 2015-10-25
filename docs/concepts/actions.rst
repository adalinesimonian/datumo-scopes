Actions
=======

Actions are used to describe what actions a user with a certain scope may take
with data.

The default actions are ``read`` and ``write``. If the action parameter of
authorization functions is omitted, then ``read`` is used by default.

Custom actions can be defined on a model by setting the static ``actions``
property to an array, where each element can be:

- A string containing the name of the action
- An object with ``name`` and ``default`` properties, where

  - ``name`` is a string containing the name of the action
  - ``default`` is a boolean that determines if the action is to be used by
    default in authorization functions where specifying the action is optional.

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

    static get actions () {
      return [{ action: 'view', default: true }, 'edit', 'share']
    }

    static get propertySets () {
      return {
        all: '*',
        name: ['givenName', 'middleName', 'familyName'],
        email: ['email']
      }
    }
  }
