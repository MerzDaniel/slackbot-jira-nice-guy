#!/bin/bash
.  ~/.profile
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"

cd ~/git/slackbot-jira-nice-guy ;
 . .env ; 
 npx babel-node index.js cron >> /tmp/log-slack-jira-bot 

