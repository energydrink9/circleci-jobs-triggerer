# Overview
This is a simple utility that helps in triggering CircleCI jobs in response to a push on a Bitbucket repository.
It allows you to trigger the push only when the changed files match one or more configured regular expressions.

# Usage

Install it globally

```bash
npm install -g circleci-jobs-triggerer
```

Create a config.json file

```js
{
  "circle_ci_token": "", // insert here your CircleCI Token
  "bitbucket_app_username": "", // insert here a bitbucket username
  "bitbucket_app_password": "", // insert here the bitbucket password
  "url": "https://circleci.com/api/v1.1/project/bitbucket/<user>/<repo>/tree", // insert here the url of the CircleCI endpoint to call (without the last branch part)
  "jobs": [ // here you can define various jobs to execute when a change in the repository matches a regular expression
    {
     "name": "job-1", // the name of the job to run
     "matches": ["file1", "dir1.*"] // various regular expressions that will trigger the build
    },
    {
     "name": "job-2", // another job to execute
     "matches": ["file2", "dir2.*"]
    }
 ]
}
```

Run it

```bash
circleci-jobs-triggerer config.json
```
