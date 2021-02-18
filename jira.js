
// https://www.npmjs.com/package/jira-connector?activeTab=explore
// https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-projects/
// https://docs.atlassian.com/jira-software/REST/7.0.4/#agile/1.0/board/{boardId}/sprint-getAllSprints

import jiraClient from "jira-connector";

var jira = new jiraClient({
  host: process.env.jiraHost,
  basic_auth: {
    email: process.env.jiraUser,
    api_token: process.env.jiraToken
  }
})

export async function getAllBoards() {
  console.log(await jira.board.getAllBoards())
}
export async function getIssue(issueId) {
  const fields = 'status,issuetype,summary'
  console.log(await jira.issue.getIssue({ issueId }))
}
export async function getAllSprints() {
  console.log((await jira.board.getSprintsForBoard({ boardId: 1, startAt: 100 })).values)
}
export async function getAllSprintIssues(id) {
  const fields = 'status,issuetype,summary'
  const { issues } = await jira.sprint.getSprintIssues({
    sprintId: id,
    fields,
    maxResults: 1000,
  })
  return issues
}
