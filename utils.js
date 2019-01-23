const querystring = require('querystring')
const axios = require('axios')
const { parse } = require('what-the-diff')

const retrieveDiff = (d, username, password) => {

  const auth = {
    username,
    password
  }

  console.log(`Retrieving diff ${d}`)

  return axios.get(d, {
    auth
  })
  .then(response => response.data)
}

const parseDiff = (diff) => {

  const parsedDiff = parse(diff)
  return parsedDiff.reduce((acc, v) => [...acc, ...(v.oldPath == null ? [] : [v.oldPath.substring(2)]), ...(v.newPath == null ? [] : [v.newPath.substring(2)])], [])
}

const getBuildsToTrigger = (jobs, changedFiles) => {

  console.log(`Changed files:\n${changedFiles.join('\n')}`)

  return jobs.filter((job) => {
    return job.matches.some(m => changedFiles.some(c => {
      return String(c).match(`^${m}$`)
    }))
  })
  .map(job => job.name)
}

const triggerBuild = (url, job, token) => {

  const auth = {
    username: token,
    password: ''
  }

  console.log(`triggering ${job} build`)

  const params = {
    "build_parameters[CIRCLE_JOB]": job
  }

  axios.post(
    url,
    querystring.stringify(params),
    {
      auth,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  ).then(() => {
    console.log(`${job} build triggered`)
  })
}

const handleWebhook = (changes, bitbucketUsername, bitbucketPassword, url, circleCiToken, jobs, branch) => {

  console.log('Handling push event')

  const diffs = changes.map(c => c.links.diff.href)

  return Promise.all(diffs.map(d => retrieveDiff(d, bitbucketUsername, bitbucketPassword)
    .then(diff => parseDiff(diff))))
    .then(values => {

    const changedFiles = values.reduce((acc, v) => [...acc, ...v], [])

    getBuildsToTrigger(jobs, changedFiles)
      .forEach(j => triggerBuild(`${url}/${branch}`, j, circleCiToken))
  })
}

module.exports = { retrieveDiff, parseDiff, getBuildsToTrigger, triggerBuild, handleWebhook }