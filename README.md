# Auth Server
Server that provides API for authentication, using Node.js and Redis

## Requirements
 * Redis https://redis.io/download
 * Node.js https://nodejs.org/en/download
 
## To run the project
`npm i` - install packages 

`redis-server` - run redis

`npm run server` - run node.js server

## API
| Routes                    |  Methods        | Description                                                                                                                                                       | Example Request 
| ------------------------- | :-------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `/api/v1/auth/register`   | POST            | accepts **username** and **password** <br> **username** - should be a *string* <br> **password** - should be a *string*                                           |  `{"username": "username",` <br> `"password": "nbiEx8Kl"}` |
| `/api/v1/auth/login`      | POST            | after successfully signing in,  <br> controller will generate **refresh**  <br> and **access tokens**                                                                    |  `{"username": "username",` <br> `"password": "nbiEx8Kl"}` |
| `/api/v1/auth/refresh`    | GET             | accepts **refresh token** from <br> **request headers**, to generate <br> new **refresh** and **access tokens** <br> and deletes the old ones       |  `"Refresh-Token", "token"`                                           |
| `/api/v1/auth/sign-out`   | GET             | accepts **access token** from  <br> **request headers**, to delete that <br> **access** and it's associated <br> **refresh token** from database                        |  `"Access-Token", "token"`                                            |

## API notes
* Each generated token has an expiration date. By default, the Access Token expires after 1 hour and the Refresh Token after 2 hours
* Tokens generated by the controller in one request are associated to each other. Therefore, having an access token, we can erase the refresh token and vice versa
