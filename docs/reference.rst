Reference
=========

.. js:class:: DatumoScopes(Model)

  :param Datumo.Model Model: The Datumo model for which to generate scopes.
  :throws Error: if the model provided is not a Datumo Model
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
        name: ['givenName', 'middleName', 'familyName'],
        email: ['email']
      }
    }
  }

  let personScopes = new DatumoScopes(Person)

.. js:function:: DatumoScopes.prototype.getScopes()

  :returns: an array of valid scopes for the model for which the current
    instance of ``DatumoScopes`` was defined.
::

  let scopes = personScopes.getScopes()

  console.log(scopes)
  // [
  //   'person-read-name',
  //   'person-write-name',
  //   'person-read-email',
  //   'person-write-email'
  // ]

.. js:function:: DatumoScopes.prototype.getPermissions(scopes[, action])

  :param string/array scopes: A scope or list of scopes to evaluate permissions
    for.
  :param string action: Name of an action as defined on the model. If specified,
    function will only return permissions for the given action.
  :returns: an array of permissions granted by the given scope(s).
  :throws Error: if the model does not have scopes or property sets defined, or
    if the property sets contain an invalid value.
::

  let permissions = personScopes.getPermissions([
    'person-read-name', 'person-read-email', 'person-write-email'
  ])

  console.log(permissions)
  // [
  //   {
  //     action: 'read',
  //     properties: ['givenName', 'middleName', 'familyName', 'email']
  //   }
  //   {
  //     action: 'write',
  //     properties: ['email']
  //   }
  // ]

  let permissions = personScopes.getPermissions([
    'person-read-name', 'person-read-email', 'person-write-email'
  ], 'read')

  console.log(permissions)
  // [
  //   {
  //     action: 'read',
  //     properties: ['givenName', 'middleName', 'familyName', 'email']
  //   }
  // ]

.. js:function:: DatumoScopes.prototype.authorize(scopes[, action, properties])

  :param string/array scopes: A scope or list of scopes to evaluate permissions
    for.
  :param string action: Name of an action as defined on the model. If omitted,
    function will use the default action (either the first action on the model,
    or the action marked as default).
  :param array properties: Array of property names to restrict the authorization
    check to.
  :returns: an array of property names the scopes grant permission for with the
    given action.
  :throws Error: if the model does not have scopes or property sets defined, or
    if the property sets contain an invalid value.
::

  let authorizedProperties = personScopes.authorize([
    'person-write-email', 'person-read-name'
  ])

  console.log(authorizedProperties)
  // ['givenName', 'middleName', 'familyName']

  let authorizedProperties = personScopes.authorize([
    'person-write-email', 'person-read-name'
  ], 'write')

  console.log(authorizedProperties)
  // ['email']

.. js:function:: DatumoScopes.prototype.scopedSubset(scopes[, action, properties])

  :param string/array scopes: A scope or list of scopes to evaluate permissions
    for.
  :param string action: Name of an action as defined on the model. If omitted,
    function will use the default action (either the first action on the model,
    or the action marked as default).
  :param array properties: Array of property names to restrict the authorization
    check to.
  :returns: a subset model class with a schema containing only the propertyies
    that the scopes grant permission for with the given action.
  :throws Error: if the model does not have scopes or property sets defined, or
    if the property sets contain an invalid value.
::

  let ScopedPerson = personScopes.scopedSubset([
    'person-write-email', 'person-read-name'
  ])

  console.log(ScopedPerson.schema)
  // {
  //   givenName: { type: 'string', required: true },
  //   middleName: { type: 'string' },
  //   familyName: { type: 'string', required: true }
  // }

.. js:function:: DatumoScopes.prototype.filter(data, scopes[, action, properties])

  :param object data: An instance of the model or an object containing model data
    for the model with which this instance of DatumoScopes was instantiated.
  :param string/array scopes: A scope or list of scopes to evaluate permissions
    for.
  :param string action: Name of an action as defined on the model. If omitted,
    function will use the default action (either the first action on the model,
    or the action marked as default).
  :param array properties: Array of property names to restrict the authorization
    check to.
  :returns: an object containing only the properties that the scopes grant
    permission for with the given action.
  :throws Error: if the model does not have scopes or property sets defined, or
    if the property sets contain an invalid value.
::

  let person = {
    givenName: 'Patricia',
    middleName: 'Girard',
    familyName: 'Couturier',
    email: 'pcouturier@example.com'
  }

  let scopedPerson = personScopes.filter(person, [
    'person-write-email', 'person-read-name'
  ])

  console.log(scopedPerson)
  // {
  //   givenName: 'Patricia',
  //   middleName: 'Girard',
  //   familyName: 'Couturier'
  // }