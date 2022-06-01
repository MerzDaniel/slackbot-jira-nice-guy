
// https://www.npmjs.com/package/jira-connector?activeTab=explore
// https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-projects/
// https://docs.atlassian.com/jira-software/REST/7.0.4/#agile/1.0/board/{boardId}/sprint-getAllSprints

import JiraClient from "jira-connector";

let jiraClient
function getJira() {
  if (!jiraClient) {
    jiraClient = new JiraClient({
      host: process.env.jiraHost,
      basic_auth: {
        email: process.env.jiraUser,
        api_token: process.env.jiraToken
      }
    })
  }
  return jiraClient
}

export async function getAllBoards() {
  console.log(await getJira().board.getAllBoards())
}
export async function getIssue(issueId) {
  const fields = 'status,issuetype,summary'
  console.log(await getJira().issue.getIssue({ issueId }))
}
export async function getAllSprints() {
  console.log((await getJira().board.getSprintsForBoard({ boardId: 1, startAt: 100 })).values)
}
export async function getAllSprintIssues(id) {
  const fields = 'status,issuetype,summary'
  const { issues } = await getJira().sprint.getSprintIssues({
    sprintId: id,
    fields,
    maxResults: 1000,
  })
  return issues
}
