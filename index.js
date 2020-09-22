
import jiraClient from 'jira-connector'
import { promises as fs } from 'fs'
import { WebClient } from '@slack/web-api'

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
const slackClient = new WebClient(process.env.slackToken)

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

const fileName = 'doneIssues.txt'
async function loadDoneIssues() {
  const t = await fs.readFile(fileName, { encoding: 'utf-8' })
  const doneIssues = t.split('\n')
  return doneIssues
}
async function persistDoneIssues(ids) {
  await fs.writeFile(fileName, ids.join('\n'))
}

async function sendMsg(msg) {
  await slackClient.chat.postMessage({
    channel: process.env.conversationId,
    text: msg,
  })
}

async function f() {
  await sendMsg('hello world')
  return
  const doneIssues = await loadDoneIssues()
  const sprintId = 118
  // await getAllBoards()
  const stuff = await getAllSprintIssues(sprintId)
  // console.log(stuff.issues)
  // console.log(stuff.map(({ fields: { status: { name } } }) => ({ name })))
  const dii = stuff.filter(({ fields: { status: { name } } }) => name === 'Done')
  const newDoneIssues = dii.filter(({ id }) => !doneIssues.includes(id))
  console.log(newDoneIssues)
  if (newDoneIssues.length > 0) {
    await persistDoneIssues([
      ...doneIssues,
      ...newDoneIssues.map(({ id }) => id ),
    ])
  }
}
f().then(() => console.log('DONE')).catch(e => console.error(e))
