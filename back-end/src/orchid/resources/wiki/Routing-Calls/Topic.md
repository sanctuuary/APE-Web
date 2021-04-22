[[_TOC_]]

# GET "/topic"

Gets all topics.
 
## Returns

returns a HttpStatus.OK and a JSON with the following structure
```
200
```

```
[
    {
        "id": "randomhexstring",
        "name": "Test"
    },
    {
        "id": "randomhexstring"
        "name": "Test"
    }
]
```