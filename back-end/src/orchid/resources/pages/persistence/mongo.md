---
...
components:
  - type: 'pageContent'
---

# MongoDB

MongoDB is a NoSQL database that is well supported and also free to use. 

## Driver

Spring uses the standard Java MongoDB Driver to connect to the database. Another option was to use MongoDB Reactive Streams driver to provide asynchronous stream processing that is non-blocking, but that is not something required for the project at the moment.

## Spring Data

Spring abstracts almost all MongoDB interactions away. Below is a description of the way entities can be created and how repositories can be used to add, edit or remove data.

### Entity

Entities can be created by providing a Kotlin class and annotating it with `@Document`. The first class member should be an `id` of type `ObjectId` annotated with `@Id`. Spring will recognize this as the document identifier and link it to the `_id` parameter in the database. The `ObjectId`'s can be generated either in the class or by the database, but a clear convention is not stated. Other parameters can be added either as `val` or `var` member depending on the intended usage, however `var` is commonly used here to allow data to be altered in the future.

### Repository

The entities are stored as documents in MongoDB collections. To access these entries, repositories are offered through Spring to retrieve or edit data. A repository can be created in Spring by making an interface class that derives `MongoRepository<>`. The template should include an entity annotated with `@Document` and an indexer like `ObjectId`, an example of this is`MongoRepository<MyEntity, ObjectId>`. To define queries for use with the repository, an interface method can be declared in the repository's declaration. The names of types of the methods are used by Spring to automatically create implementations of these interface methods. This process happens at runtime when Spring initializes. Errors denoted as missing repository bean definitions are likely because method or interface class definitions are deemed invalid.