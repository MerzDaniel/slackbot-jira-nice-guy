
import {promises as fs} from "fs";

const fileName = 'doneIssues.txt'
export async function loadDoneIssues() {
  try {
    const t = await fs.readFile(fileName, {encoding: 'utf-8'})
    const doneIssues = t.split('\n')
    return doneIssues
  } catch (e) { return [] }
}
export async function persistDoneIssues(ids) {
  await fs.writeFile(fileName, ids.join('\n'))
}
