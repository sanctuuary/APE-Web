[[_TOC_]]

# GET /user/{userId}

Get the user information. 

## Authorization

The authenticated user can only retrieve its own data.

Admins can retrieve every user's data.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```

```
{
    "userId": "5f8d8bf7f7362d35062ec1a5",
    "email": "test@test.com",
    "displayName": "test",
    "status": "Approved",
    "admin": false
}
```

# POST /api/user/login

Log in. Creates a new sessions which is authenticated

## Parameters

Required:
- username `string`: the username of the user.
- password `string` = the password of the user.

## Returns

Returns a HttpStatus.OK and a JSON with the following structure:
```
200
```

```
{
    "userId": "5f8d8bf7f7362d35062ec1a5",
    "email": "test@test.com",
    "displayName": "test",
    "status": "Approved",
    "admin": false
}
```
# POST /api/user/register

Register a user account. Account will be set to unapproved until an admin approves the account request. The user can already login immediately after registration, but additional authorities will only be granted after approval.

## Parameters

Required:
- username `string`: the username of the user.
- password `string`: the password of the user.
- displayName `string`: the publicly visible name of the user.
- motivation `string`: the reason why the user wants an account.

## Returns

Returns a HttpStatus.CREATED when successful

```
201
```

Returns a HttpStatus.CONFLICT when email was already used

```
409
```