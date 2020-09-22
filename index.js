
import jiraClient from 'jira-connector'

// https://www.npmjs.com/package/jira-connector?activeTab=explore
// https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-projects/
// https://docs.atlassian.com/jira-software/REST/7.0.4/#agile/1.0/board/{boardId}/sprint-getAllSprints

var jira = new jiraClient({
  host: process.env.jiraHost,
  basic_auth: {
    email: process.env.jiraUser,
    api_token: process.env.jiraToken
  }
})

async function getAllBoards() {
  console.log(await jira.board.getAllBoards())
}
async function getAllSprints() {
  console.log((await jira.board.getSprintsForBoard({ boardId: 1, startAt: 100 })).values)
}
async function getAllSprintIssues(id) {
  const { issues } = await jira.sprint.getSprintIssues({ sprintId: id, fields: 'status' })
  return issues
}


async function f() {
  // await getAllBoards()
  const stuff = await getAllSprintIssues(118)
  // console.log(stuff.issues)
  console.log(stuff.map(({ fields: { status: { name } } }) => ({ name })))

}
f().then(() => console.log('DONE')).catch(e => console.error(e))
