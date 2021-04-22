[[_TOC_]]

# GET /api/pending-requests

Retrieve a list of users awaiting approval.

## Authorization

Only admin users.

## Returns

Returns HttpStatus.OK if successful, and a JSON of pending user requests
```
200
```
```
[
    {
       "id": "5f8d8bf7f7362d35062ec1a5",
       "email": "test@test.com",
       "displayName": "Test"
       "motivation": "Test",
       "creationDate": 22/01/2021
     },
]
```


# POST /api/admin/approval

Approve or deny a user account access request. Only admins can access this link or perform this operation.

## Authorization

Only admin users.

## Request
The following data can be sent:
```
{
    "requestId": "5f8d8bf7f7362d35062ec1a5",
    "email": "test@test.com",
    "status": "Approved"
}
```

**RequestId** is the unique identifier for the user's account access request.
**Email** is the user's email which is to be approved or declined.
**Status** is the admin's response to the request, either 'Approved' or 'Denied'

## Returns

Returns HttpStatus.OK if successful
```
200
```

# POST "/api/admin/topic/upload"

Uploads a topic based on the given name parameter.

## Parameters

```
{
    "name": "TestTopic"
}
```

## Authorization

Only admin users.

## Returns

Returns a HttpStatus.isCreated.
```
201
```

