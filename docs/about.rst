What is datumo-scopes?
======================

datumo-scopes is an opinionated library that helps you control access to data on
`Datumo`_ models on a per-property basis using scopes.

Why?
----

Data models in an application can often contain properties that have data of
variyng levels of secrecy and sensitivity. A "Person" model may contain publicly
known information, such as a person's name, but may also contain sensitive
information such as a person's government ID numbers or password hashes.

Users using the application can have varying levels of access, all depending on
many different variables. However, thanks to the advent of authorization servers
based on standards such as OAuth 2.0, determining what levels of access a user
has, or the *scopes* that apply to them, is trivial.

But after the user has received authorization, the application must still sort
through the jumble of classified and unclassified information, and only allow
the user to work with the parts of the data that they have permissions for,
based on their scopes. This is not as trivial.

Defining separate models for each different combination of possible permissions
doesn't scale well as the permutations of possible permissions grow. Ad-hoc code
sprinkled throughout the code-base that filters out specific data is tough to
maintain, and increases the number of points of failure.

How?
----

To solve this problem, datumo-scopes offers an easy, though opinionated,
approach to handling scopes and controlling access to data models on a
per-property basis.

datumo-scopes uses scopes of the following format::

  modelname-action-propertyset

- The model name indicates the data model for which the scope is defined.
- The action is an action the user may take with the data. For example, ``read``
  or ``write``.
- The property set is a named group of properties that the scope applies to.

This naming pattern for scopes allows datumo-scopes to easily determine what
subsets of a data model the user has access to, and allow them only to work with
that particular subset of data.

.. _Datumo: https://github.com/vsimonian/datumo
