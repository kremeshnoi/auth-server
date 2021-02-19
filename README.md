# Auth Server
Server that provides API for authentication, using Node.js and Redis
### Requirements
 * Redis https://redis.io/download
 * Node.js https://nodejs.org/en/download
 
### To run the project
`npm i` - install packages 

`redis-server` - run redis

`npm run server` - run node.js server

### API
`/api/v1/auth/register/` - request method [POST] : accepts username and password
* username should be a string
* password should be a string


```
{
    "username": "example_username",
    "password": "example_%p4$sW0rd#"
}
```
`/api/v1/auth/login/` - request method [POST] : accepts the same credentials as above. After successfully signing in, 
controller will generate bounded between themselves "refresh" and "access" tokens with expiration time

`/api/v1/auth/refresh/` - request method [GET] : accepts "refresh" token from request headers, to generate new bounded between themselves
"refresh" and "access" tokens for user with expiration time. The old ones, will be deleted from database

`/api/v1/auth/sign-out/` - request method [GET] : accepts "access" token from request headers, and delete that "access" token
and its associated "refresh" token from the database
