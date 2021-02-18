import { exit } from 'process'
import {loadDoneIssues, persistDoneIssues} from "./persistance";
import {getAllSprintIssues, getAllSprints, getIssue} from "./jira";
import {sendMsg} from "./slack";
import {getRandomQuote} from "./quotes";

function issueTypeToMsg(issueType) {
  if (issueType === 'Story') return `*${issueType}* :large_green_circle: `
  if (issueType === 'Bug') return `*${issueType}* :red_circle: `
  if (issueType === 'Task') return `*${issueType}* :large_blue_circle: `
  else return `*${issueType}*`
}
async function bot(postToSlack = true) {
  // await sendMsg('hello world')

  const doneIssues = await loadDoneIssues()
  // await getAllBoards()
  const stuff = await getAllSprintIssues(process.env.sprintId)
  // filter for Tasks only (sub-tasks are also returned)
  const sprintTasks = stuff.filter(({ fields: { issuetype: { name }}  }) => name !== 'Sub-task')
  // const nonSprintTasks = stuff.filter(({ fields: { issuetype: { name }}  }) => name === 'Sub-task')
  // console.log(nonSprintTasks.length)
  // console.log(sprintTasks.map(({ fields: { issuetype: { name }, summary } }) => summary))
  // return console.log(sprintTasks.map(({ fields: { issuetype: { name }}}) => name))
  // console.log(stuff.map(({ fields: { status: { name } } }) => ({ name })))
  const dii = sprintTasks.filter(({ fields: { status: { name } } }) => name === 'Done')
  const newDoneIssues = dii.filter(({ id }) => !doneIssues.includes(id))
  // console.log(newDoneIssues)
  if (newDoneIssues.length > 0) {
    let msg = 'New tasks are done! :muscle:\n'
    newDoneIssues.forEach(async ({ key, fields: { summary, issuetype: { name: issueType } } }) => {
      msg += `- *${issueType}*: ${summary}\nhttps://${process.env.jiraHost}/browse/${key}\n`
    })
    msg += `\n${getRandomQuote()}`

    if (postToSlack) await sendMsg(msg)
    else console.log(msg)

    await persistDoneIssues([
      ...doneIssues,
      ...newDoneIssues.map(({ id }) => id ),
    ])
  }
}
const r = f => f().then(() => console.log('DONE')).catch(e => console.error(e))
function runBot() {
  setInterval(
    () => r(bot),
    1000*JSON.parse(process.env.intervalInSeconds)
  )
}

// const quote = getRandomQuote()
// const msg = quote.text + " - " + quote.author
// console.log(msg)
// sendMsg(msg).then(console.log).catch(console.error)


const secondLastArg = process.argv[process.argv.length-2]
const lastArg = process.argv[process.argv.length-1]
if (lastArg.startsWith('sprints')) r(getAllSprints)
else if (lastArg.startsWith('sprint-tasks')) getAllSprintIssues(process.env.sprintId).then(console.log)
else if (lastArg.startsWith('init')) bot(false).then()
else if (lastArg.startsWith('start')) runBot()
else if (secondLastArg.startsWith('issue')) getIssue(lastArg)
else if (lastArg.startsWith('cron')) r(bot)
else { console.log('Missing cmd args'); exit(1) }
