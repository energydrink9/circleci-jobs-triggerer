
const express = require('express')
const path = require('path')

const { handleWebhook } = require('./utils')

const defaultPort = process.env.PORT

const args = process.argv.slice(2)

if (args.length < 1) {

  console.error('Please specify a config file')

  process.exit(1)
}

const configFile = args[0]
const port = args[1] != null ? parseInt(args[1]) : parseInt(defaultPort)

const config = require(path.resolve(configFile))

const app = express()

app.use(express.json())

app.post('/', (req, res, next) => {

  handleWebhook(
    req.body.push.changes,
    config.bitbucket_app_username,
    config.bitbucket_app_password,
    config.url,
    config.circle_ci_token,
    config.jobs,
    req.body.push.changes[0].new.name
  ).then(() => {
    res.sendStatus(200)
  })
})

app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}!`))