'use strict';

//var Botkit = require('botkit')
var Botkit = require('./lib/Botkit.js')
//var aiml = require('aimlinterpreter')
var aiml = require('./lib/AIMLInterpreter.js')

var slackToken = process.env.SLACK_TOKEN
var controller = Botkit.slackbot({ debug: false })

controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) 
{
  if (err) 
    throw new Error('Error connecting to Slack: ', err)
  console.log('Connected to Slack')
});

var aimlInterpreter = new aiml({name:'muddbot', age:'1'});

//aimlInterpreter.loadAIMLFilesIntoArray(['./knockknock.aiml']);
aimlInterpreter.loadAIMLFilesIntoArray(['./tictactoe.aiml','./knockknock.aiml']);

var callback = function(answer, wildCardArray, input){
console.log(answer + ' | ' + wildCardArray + ' | ' + input);
};

controller.hears('.*',   'direct_message,direct_mention', function (bot,message) 
{
  const msg = message.text;

  console.log('received message : ',msg, 'from :',message.user_name);
  aimlInterpreter.findAnswerInLoadedAIMLFiles(msg, function(answer, wildCardArray,input)
  {
    if (answer == undefined)
    {
      console.log('reply is undefined');
      bot.reply(message,'I have no idea what you are saying');
    }
    else
    {
      answer = answer.replace(/\^n/gi,'\n');
      answer = answer.replace(/\^s/gi,' ');

      console.log('replying with:', answer, '| wildcard :',wildCardArray,' | input: ',input);

      bot.reply(message,answer);
    }
  });

});

