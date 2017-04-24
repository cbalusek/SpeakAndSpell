'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.ask.skill.23a1da17-7f0b-4d47-b71f-367f3be4e85d'; //'amzn1.echo-sdk-ams.app.your-skill-id';
//var levelAWords = ['ABOVE', 'ANGEL', 'ANSWER', 'CALF', 'DOES', 'EARTH', 'ECHO', 'EXTRA', 'FIVE', 'FOR', 'FOUR', 'GUESS', 'HALF', 'HEALTH', 'IRON', 'LEARN', 'NINE', 'OCEAN', 'ONCE', 'ONE', 'OVEN', 'PINT', 'PULL', 'RANGE', 'SAYS', 'SIX', 'SKI', 'SURE', 'SWAP', 'TALK', 'TEN', 'THREE','TOUCH', 'VIEW', 'WARM', 'WAS', 'WASH', 'WORD', 'ZERO'];
var levelAWords = ['ABOVE', 'ANGEL', 'ANSWER', 'CALF', 'DOES', 'EARTH', 'ECHO', 'EXTRA', 'FIVE', 'GUESS', 'HALF', 'HEALTH', 'IRON', 'LEARN', 'NINE', 'OCEAN', 'ONCE', 'ONE', 'OVEN', 'PINT', 'PULL', 'RANGE', 'SAYS', 'SIX', 'SKI', 'SURE', 'SWAP', 'TALK', 'TEN', 'THREE', 'TO', 'TOUCH', 'TWO', 'VIEW', 'WARM', 'WAS', 'WASH', 'WORD', 'ZERO'];
//Commented out level A words is original list and includes homynyms FOR, FOUR, TWO, and TO.  In future version, I will take care of managing for those
var levelBWords = ['ANOTHER', 'BEAUTY','BEIGE','BLOOD','BULLET','CARRY','CHALK','CHILD','DANGER','EARLY','EIGHT','FLOOD','FLOOR','FRONT','GUIDE','HASTE','HEAVEN','LINGER','MIRROR','OTHER','PRIEST','READY','RURAL','SCHOOL','SEVEN','SQUAD','SQUAT','SUGAR','TODAY','UNION','WATCH','WATER','YIELD'];
var levelCWords = ['ALREADY','BELIEVE','BUILT','BUSHEL','COMFORT','COMING','COUPLE','COUSIN','ENOUGH','FINGER','GUARD','HEALTHY','HEAVY','INSTEAD','LAUGH','MEASURE','MOTHER','NIECE','OUTDOOR','PERIOD','PLAGUE','POLICE','PROMISE','QUIET','RANGER','RELIEF','REMOVE','SEARCH','SHIELD','SHOULD','SHOVEL','SOMEONE','SOURCE','STATUE','TERROR','TROUBLE','WELCOME','WOLVES','WOMAN','WONDER','WORTH'];
var levelDWords = ['ABSCESS','ANCIENT','ANYTHING','BROTHER','BUREAU','BUTCHER','CARAVAN','CIRCUIT','CORSAGE','COURAGE','DISCOVER','DUNGEON','EARNEST','FEATHER','GREATER','JEALOUS','JOURNEY','LANGUAGE','LAUGHTER','LEISURE','LETTUCE','MACHINE','MINUTE','PIERCE','PLEASURE','PLUNGER','POULTRY','QUOTIENT','RHYTHM','SCHEDULE','SCISSORS','SHOULDER','SERIOUS','STOMACH','STRANGER','SURGEON','TOMORROW','TREASURE','WORKMAN','YACHT'];
//For level D words, I skipped couldn't - will add it another time

var wordArray = [''];
var maxWords = 10; //set if you want a shorter game for testing
var speechOutput = '';
var levelMessage = 'You will need to pick a level to continue.  You can pick Level A, which is the easiest,  B.,  C., or  D., which is the hardest.  Which level would you like?';
var levelReprompt = 'Say A, B, C, or D.'

 


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers, levelHandlers);
    alexa.execute();
};

var states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE',  // Prompt the user to start or restart the game.
    LEVELMODE: '_LEVELMODE'  // Prompt the user to pick a level
};

//start a new session
var newSessionHandlers = {
    'NewSession': function() {
        console.log('New session');
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['endedSessionCount'] = 0;
            this.attributes['gamesPlayed'] = 0;
        }
      
        var speechOutput = '';
        this.handler.state = states.STARTMODE;
        this.emit(':ask', 'Welcome to speak and spell. would you like to play?',
            'Say yes to start the game or no to quit.');
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      console.log('cancel');
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    }
};

//once we ask the user if they want to play, process the answer
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        var message = 'I will prompt you to spell a word.  You will then spell it and I will tell you if you are correct.  Do you want to play?';
        this.emit(':ask', message, message);
    },
    "AMAZON.YesIntent": function() {
        console.log('yes intent is working');
        this.handler.state = states.LEVELMODE;
        this.emitWithState(':ask', levelMessage, levelReprompt);

    },


    "AMAZON.NoIntent": function() {
        console.log("NOINTENT");
        this.emit(':tell', 'Ok, see you next time!');
    },
    "AMAZON.StopIntent": function() {
      console.log("STOPINTENT");
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      console.log("CANCELINTENT");
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        this.emit(':tell', "Goodbye!");
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});

//once we ask the user if they want to play, process the answer
var levelHandlers = Alexa.CreateStateHandler(states.LEVELMODE, {

    
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', levelMessage, levelReprompt);
    },

    "LevelIntent": function() {

        console.log('level intent is working');
        var levelChoice = (this.event.request.intent.slots.Level.value);
        console.log('level selected is ' + levelChoice);

        levelChoice = levelChoice.toUpperCase();
        console.log('after upper case the level is ' + levelChoice);

        this.handler.state = states.GUESSMODE;
        switch (levelChoice) {
            case 'A.': 
                 wordArray = levelAWords;
                 break;
            case 'A': 
                 wordArray = levelAWords;
                 break;
            case 'B.':
                wordArray = levelBWords;
                 break;
            case 'B':
                wordArray = levelBWords;
                 break;
            case 'C.':
                wordArray = levelCWords;
                 break;
            case 'C':
                wordArray = levelCWords;
                 break;
            case 'D.':
                wordArray = levelDWords;
                 break;
            case 'D':
                wordArray = levelDWords;
                 break;
        };

       // wordArray = levelAWords;
       console.log(wordArray);
        this.emitWithState('ClearIntent');
     
    },

    "AMAZON.StopIntent": function() {
      console.log("STOPINTENT");
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      console.log("CANCELINTENT");
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        //this.attributes['endedSessionCount'] += 1;
        this.emit(':tell', "Goodbye!");
    },
    'Unhandled': function() {
        console.log("UNHANDLED - level");
        this.emit(':ask', levelMessage, levelReprompt);
    }
});


//play the game!
var guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },

    'ClearIntent':  function(){
        this.attributes['spellingWord'] = '';
        this.attributes['numberOfWords'] = 0;
        this.attributes['numberOfCorrectWords'] = 0;
        console.log('All clear');
        speechOutput = '';
        console.log('for example, numberOfWords is ' + this.attributes['numberOfWords']);
        this.emitWithState('WordIntent');
    },

    'WordIntent': function() {
        console.log('WordIntent launched');
        this.attributes['tries'] = 0;
        console.log('tries = ' + this.attributes['tries'] );
        console.log('the length of the array is ' + wordArray.length);
        
        //spellingWord = pickAWord(wordArray);
        this.attributes['spellingWord'] = pickAWord(wordArray);

        console.log('the spelling word is ' + this.attributes['spellingWord']);
        console.log('the length of the array after picking a word is ' + wordArray.length);

         this.attributes['numberOfWords'] =  this.attributes['numberOfWords'] + 1;

        console.log('Number of words = ' +  this.attributes['numberOfWords']);
        if ( this.attributes['numberOfWords'] < (maxWords + 1)) {
            speechOutput = speechOutput + '<s>Spell ' + this.attributes['spellingWord']+'</s>'; 
            console.log('speechOutput = '+ speechOutput);
           this.emit(':ask', speechOutput, 'Try again.  Spell ' + this.attributes['spellingWord']);
        }  else {
            console.log('Max words hit');
            speechOutput = speechOutput + '<s>Game over!</s>  You got ' + this.attributes['numberOfCorrectWords'] + ' out of ' + maxWords + ' correct.';
            console.log('speechoutput is ' + speechOutput);
            this.emit(':tell', speechOutput);
        }
        

    },
  
   'GuessIntent': function() {
        console.log('GuessIntent');
  
        var guess = (this.event.request.intent.slots.Answer.value);

        console.log('user guessed: ' + guess);
        if (guess == this.attributes['spellingWord'])  {
            console.log('Word is spelled right');
            speechOutput = 'You spelled ' + this.attributes['spellingWord'] + ' correctly.  ';
            console.log('speechOutput generated');
            console.log('speechOutput is ' + speechOutput);
            //this.emit(':tell', 'It is working!');}
            this.attributes['numberOfCorrectWords'] = this.attributes['numberOfCorrectWords'] + 1;
            console.log('numberOfCorrectWords = ' + this.attributes['numberOfCorrectWords']);
            this.emitWithState('WordIntent');}
        else {this.emitWithState('Unhandled');}

    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
            ' if it is higher or lower.', 'Try saying a number.');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
        this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        this.attributes['endedSessionCount'] += 1;
        this.emit(':tell', "Goodbye!");
    },

    'Unhandled': function() {
        console.log("UNHANDLED in Gamemode");
        this.attributes['tries']++;
        console.log('tries = ' + this.attributes['tries']);

        if (this.attributes['tries'] < 2){
            this.emit(':ask', 'That is incorrect.  Try again.  Spell ' + this.attributes['spellingWord']);
        }
        else {
            var spellingWordWithDots = addPeriods(this.attributes['spellingWord']);
            console.log("with dots the word is " + spellingWordWithDots);
            speechOutput = 'That is incorrect.  The correct spelling is ' + spellingWordWithDots;
            //this.emit(':tell', 'That is incorrect.  The correct spelling is ' + spellingWordWithDots);
            this.emitWithState('WordIntent');
            }
    }
});

function addPeriods(bigWord){
    var numberCharacters = bigWord.length;
    var wordWithPeriods = '';
    console.log('the word ' + bigWord + ' has ' + numberCharacters + ' characters');
    for (var i=0; i<numberCharacters; i++){
        var letterAtPosition = bigWord.charAt(i);
        wordWithPeriods = wordWithPeriods + letterAtPosition + '.';
    }

    return wordWithPeriods;
};


function pickAWord(arr) {  
    var itemIndex = Math.floor(Math.random() * arr.length);  
    var itemValue = arr[itemIndex]  
    arr.splice(itemIndex,1);  
    console.log('the word is going to be ' + itemValue);
    return itemValue;  
}

