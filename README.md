# socketexample

This is a code sample demonstrating the basic (very basic) setup of connecting a React frontend (created with Create React App) and an Express backend.

Things to consider:

- `socket.io` defaults to using long polling over http rather than websockets. This would make it more reliable to older browsers. But honestly, IE 11 even supports websockets so unless you need to support really old operating systems, this requirement is not necessary.
- You don't need `socket.io`. Regular websockets work just fine. But there is more work to do to uniquely identify and manage each client connection. [See this StackOverflow](https://stackoverflow.com/questions/10112178/differences-between-socket-io-and-websockets).



## Resources

- [WebSockets for fun and profit](https://stackoverflow.blog/2019/12/18/websockets-for-fun-and-profit/)

## About the Create React Express Boilerplate

This setup allows for a Node/Express/React app which can be easily deployed to Heroku.

The front-end React app will auto-reload as it's updated via webpack dev server, and the backend Express app will auto-reload independently with nodemon.

## Starting the app locally

Start by installing front and backend dependencies. While in this directory, run the following command:

```
npm install
```

This should install node modules within the server and the client folder.

After both installations complete, run the following command in your terminal:

```
npm start
```

Your app should now be running on <http://localhost:3000>. The Express server should intercept any AJAX requests from the client.

## Deployment (Heroku)

To deploy, simply add and commit your changes, and push to Heroku. As is, the NPM scripts should take care of the rest.
