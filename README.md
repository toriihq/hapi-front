# hapi-front

Deploy powerful, scalable applications, using [hapi](https://hapi.dev) on top of AWS Lambda and Amazon API Gateway.

## About

hapi-front turns your regular hapi server into a serverless function, easily deployable on AWS. 

It does so using a translation layer between AWS requests, and regular HTTP requests sent into your hapi server.

Inspired by [serverless-http](https://github.com/dougmoscrop/serverless-http). Tailored for hapi.

## Goals

- Code regular [hapi](https://hapi.dev) servers, deploy as serverless 🚀
- Single command deployment
- No external dependencies

## Install

```bash
yarn add hapi-front
```

or

```bash
npm install hapi-front --save
```

## Usage

Wrap your current server initialization code with `hapi-front`:

```javascript
// server.js
module.exports = async () => {
  const server = Hapi.server({
    port: process.env.port || 3000,
    host: 'localhost'
  })

  // define routes here

  return server 
}


// index.js
const front = require('hapi-front')
const init = require('./server')

module.exports.handler = front(init)
```

## Full Example

See [example](example) folder for a full example that uses the [Serverless Framework](https://github.com/serverless/serverless).

### Local development

Use `serverless-offline` plugin to run locally:
  
```bash
serverless offline
```

Or, simply create a wrapper around `server.js` to run as a rugaulr hapi server:
```javascript
const init = require('./server')

let server

const go = async () => {
  server = await init()
  await server.start()
  console.log(`Server ready on ${server.info.uri}`)
}

go()
  .then(console.log)
  .catch(console.log)
```

### Deployment

To deploy:

```bash
serverless deploy
```