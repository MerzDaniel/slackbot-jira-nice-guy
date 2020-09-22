
import jiraClient from 'jira-connector'


async function f() {
  var jira = new jiraClient({
    host: process.env.jiraHost,
    basic_auth: {
      email: process.env.jiraUser,
      api_token: process.env.jiraToken
    }
  })
  
  const issue = await jira.issue.getIssue({ issueKey: 'PA-1111' })
  console.log(issue)
}
f().then(() => console.log('DONE')).catch(e => console.error(e))
