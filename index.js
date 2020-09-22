
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
  const fields = 'status,issuetype,summary'
  const { issues } = await jira.sprint.getSprintIssues({ 
    sprintId: id, 
    fields,
  })
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
  // await sendMsg('hello world')

  const doneIssues = await loadDoneIssues()
  // await getAllBoards()
  const stuff = await getAllSprintIssues(process.env.sprintId)
  // filter for Tasks only (sub-tasks are also returned)
  const sprintTasks = stuff.filter(({ fields: { issuetype: { name }}  }) => name !== 'Sub-task')
  // return console.log(sprintTasks.map(({ fields: { issuetype: { name }}}) => name))
  // return console.log(sprintTasks[0])
  // return console.log(sprintTasks)
  // console.log(stuff.map(({ fields: { status: { name } } }) => ({ name })))
  const dii = sprintTasks.filter(({ fields: { status: { name } } }) => name === 'Done')
  const newDoneIssues = dii.filter(({ id }) => !doneIssues.includes(id))
  // console.log(newDoneIssues)
  if (newDoneIssues.length > 0) {
    await persistDoneIssues([
      ...doneIssues,
      ...newDoneIssues.map(({ id }) => id ),
    ])
    await Promise.all(newDoneIssues.map(async ({ key, fields: { summary, issuetype: { name: issueType } } }) => {
      const msg = `:bell: New ${issueType} is Done :) ${summary}\nhttps://${process.env.jiraHost}/browse/${key}`
      await sendMsg(msg)
      // console.log(msg)
    }))
  }
}
f().then(() => console.log('DONE')).catch(e => console.error(e))
