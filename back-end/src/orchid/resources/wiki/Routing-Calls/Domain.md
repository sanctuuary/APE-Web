[[_TOC_]]

# GET "/domain"

Gets all public domains.

## Parameters

Required:
- userID (as a pathVariable) = the userID as in the database
 
## Returns

returns a HttpStatus.OK and a JSON with the following structure
```
200
```

```
[
    {
        "id": "randomhexstring",
        "title": "Test",
        "topics": [
            "Test"
        ]
    },
    {
        "id": "randomhexstring"
        "title": "Test",
        "topics": [
            "Test",
            "Test"
        ]
    }
]
```

# GET "/domain/{id}"

## Authorization

None for public domains.

If domain is private, only user with granted access.

## Parameters

Required:
- domainID(as a pathVariable) = the domainID as in the database

## Returns

returns a HttpStatus.OK and a JSON with the following structure
```
200
```

```
{
    "id": "5fcbc4ff17f9920d48980411",
    "title": "Domain title",
    "description": "Example description",
    "visibility": "Public",
    "topics": [
        "Topic1"
    ],
    "ontologyPrefixIRI": "http://www.co-ode.org/ontologies/ont.owl#",
    "toolsTaxonomyRoot": "Tool",
    "dataDimensionsTaxonomyRoots": [
        "Type",
        "Format"
    ]
}
```

# POST "/api/domain/upload"

content-Type set to multipart/form-data

## Authorization

Approved users can upload a new domain. 

## Parameters

Required:
- title `string` = title of the domain
- description `string` = description of the domain
- topics `string[]` = topicId's of topics in the domain
- visibility `string` = visibility of the domain, from {Private, Public}
- ontologyPrefix `string` = prefix of the ontology file
- toolsTaxonomyRoot `string` = root of the tools taxonomy
- dataDimensionsTaxonomyRoots `string[]` = list of Strings with the data dimension roots of the ontology
- ontology `multipart-file` = $name.owl 
- toolsAnnotations `multipart-file` = $name.json
- strictToolsAnnotations `boolean` = indicator if the domain uses strict tools annotations
- useCaseRunConfig `multipart-file` = $name.json
- useCaseConstraints `multipart-file` = $name.json

## Example for ImageMagick

- title = "Image magick"
- description = "Domain to explore image manipulation"
- topics = "randomhexstring"
- topics = "anotherrandomhexstring"
- visibility = "Public"
- ontologyPrefix = "http://www.co-ode.org/ontologies/ont.owl#"
- toolsTaxonomyRoot = "Tool"
- dataDimensionsTaxonomyRoots = "Type"
- dataDimensionsTaxonomyRoots = "Format"
- ontology = imagemagick.owl
- toolsAnnotations = toolsAnnotationsImageMagick.json
- useCaseRunConfig = useCaseConfig.json
- useCaseConstraints = useCaseConstraints.json

Take note, to have multiple data dimensions multiple form fields need to be provided. In this case two dimension are provided.

## Returns
- id `string` = plain string containing domain id
returns a HttpStatus.CREATED.
```
201
```

# PATCH "/domain/{id}"

content-Type set to multipart/form-data

## Authorization

User with read/write access or ownership can update their existing domain.

## Parameters

Optional:
- title `string` = title of the domain
- description `string` = description of the domain
- topics `string[]` = topicId's of topics in the domain
- visibility `string` = visibility of the domain, from {Private, Public}
- ontologyPrefix `string` = prefix of the ontology file
- toolsTaxonomyRoot `string` = root of the tools taxonomy
- dataDimensionsTaxonomyRoots `string[]` = list of Strings with the data dimension roots of the ontology
- ontology `multipart-file` = $name.owl 
- toolsAnnotations `multipart-file` = $name.json
- strictToolsAnnotations `boolean` = indicator if the domain uses strict tools annotations
- useCaseRunConfig `multipart-file` = $name.json
- useCaseConstraints `multipart-file` = $name.json

## Example for ImageMagick

- title = "Image magick"
- description = "Domain to explore image manipulation"
- topics = "randomhexstring"
- topics = "anotherrandomhexstring"
- visibility = "Public"
- ontologyPrefix = "http://www.co-ode.org/ontologies/ont.owl#"
- toolsTaxonomyRoot = "Tool"
- dataDimensionsTaxonomyRoots = "Type"
- dataDimensionsTaxonomyRoots = "Format"
- ontology = imagemagick.owl
- toolsAnnotations = toolsAnnotationsImageMagick.json
- useCaseRunConfig = useCaseConfig.json
- useCaseConstraints = useCaseConstraints.json

Take note, to have multiple data dimensions multiple form fields need to be provided. In this case two dimension are provided.

## Returns
returns a HttpStatus.OK.
```
200
```

# GET "/api/domain/with-user-access"

Query both public and private domains which the user has been granted access to. Includes ownership of domains if specified in the access rights list.

## Authorization

Approved users can query domains they own or have been granted access to.

## Parameters

Parameters must be included in the url, not in the request body.

- userId `string` = "5fb2a1b764bf1460f6b42d80"
- accessRights `[string]` = DomainAccess options to include, choose from {Owner, ReadWrite, Read, Revoked}

## Example
```
  ?userId=5fb2a1b764bf1460f6b42d80&accessRights=Owner,ReadWrite,Read
```

## Returns
List of the following object:
- id `string` = unique domain identifier
- title `string` = recognisable name of the domain
- description `string` = information about the domain
- visibility `string` = indicates if domain is visible to other users, from {Private, Public}
- topics `[string]` = list of topics to which the domain relates
- userId `string` = requesting user whose access is mentioned for the domain
- access `string` = the access rights on the domain granted to the requesting user, from {Owner, ReadWrite, Read}

Returns a HttpStatus.OK and the JSON structure as above in a list.
```
200
```

# GET "api/domain/download/ontology/{domainId}"

## Authorization

None for public domains.

If the domain is private, only allowed users can download this.

## Parameters

Required:
- domainID(as a pathVariable) = the domainID as in the database

## Returns
The ontology file


# GET "api/domain/download/tools-annotations/{domainId}"

## Authorization

None for public domains.

If the domain is private, only allowed users can download this.

## Parameters

Required:
- domainID(as a pathVariable) = the domainID as in the database

## Returns
The tools annotations file

# GET "api/domain/download/config/{domainId}"

## Authorization

None for public domains.

If the domain is private, only allowed users can download this.

## Parameters

Required:
- domainID(as a pathVariable) = the domainID as in the database

## Returns
A zip containing the ontology file, tool-annotations file, use case configs.