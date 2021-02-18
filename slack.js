
import {WebClient} from "@slack/web-api";

export const slackClient = new WebClient(process.env.slackToken)

export async function sendMsg(msg) {
  console.log(process.env.slackToken)
  console.log(process.env.conversationId)
  await slackClient.chat.postMessage({
    channel: process.env.conversationId,
    text: msg,
  })
}
