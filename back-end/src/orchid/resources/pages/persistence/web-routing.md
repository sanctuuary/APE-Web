---
...
components:
- type: 'pageContent'
---

# Routing

We have divided the routing of calls into two main parts. Regular calls and AJAX calls. 

## Routing Path Generic Structure

```
|
|____ "api/"
|  |
|  |__admin
|  |__domain
|  |__user
|  |__workflow
|
|____ "/"
   |
   |__domain
   |__topic
   |__user
   |__workflow
```
With the "api" route reserved for AJAX calls and "/" reserved for regular calls

## A path for every entity
The paths are sub-divided further based on their related entity. Which means that when an AJAX call related to a domain 
is made, it follows the path 'api/domain/** ' where '**' is defined by methods within that class that handles the entry-point.
This provides a clear distinction between Request mappings. 

## Request Mapping in Spring
Spring allows a class to encapsulate an entire extension of a path. Such as described before, the class DomainController.kt, encapsulates the path "/domain/**"
The sub-mapping can then be specified by methods. This is done by annotations such as: @GetMapping("/{id}"). This sets a listener to the path "/domain/{id}". 
The method is called when a GET-request is made to this path. All requests have their own mapping annotations.

# Parsing of user-data with spring
The parsing of user-data sent from the front-end is done by Spring. This allows the back-end to specify detailed data-classes that are required for a specific route.
Spring will map the incoming request and try to parse the data provided into the required parameter. If it fails an error is produced, and a 500 is sent back.

## Empty parameters
Spring allows for the parameters to be optional, this can be done in Kotlin by overloading a method in place, by specifying the standard value of the parameter when it is not present

# Error handling in Spring
Spring may throw errors before our own error handling can get in between. The response that Spring sends can be very vague, which is a major drawback.
Error handling within the routing methods is done through a try-block with all the logic within that block. 
A pattern-match is done on the thrown exception and an appropriate message, and error code is sent back

