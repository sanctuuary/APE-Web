The interaction with the database in the back-end is abstracted with classes in the persistence package. The request handler should only use this abstraction and not directly the repositories for the database collections.

Please look at the following classes in the API Docs for correct usage:

- DomainOperation
- UserOperation
- TopicOperation