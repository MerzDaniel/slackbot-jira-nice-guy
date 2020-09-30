#!/bin/bash
. /home/daniel/.bashrc

cd /home/daniel/git/slack-jira-bot ;
 . .env ; 
 /home/daniel/.nvm/versions/node/v12.14.1/bin/npx babel-node index.js cron >> /tmp/log-slack-jira-bot 