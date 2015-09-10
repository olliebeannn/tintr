$(document).ready(function() {
  var game;

  $('#input-numQuestions, #input-numColors').blur(checkUserInput);

  $('#btn-startGame').click(function() {
    var numQuestions = $('#input-numQuestions').val();
    var numColors = $('#input-numColors').val();

    //Create a game with a number of questions, right and wrong answers
    game = new Game(numQuestions, numColors);
    $('#startgame-container').addClass('hidden');
    $('#game-container').removeClass('hidden');

    //Create number of color boxes based on input
    createBoxes(game.numberOfColors);

    //Generate next question
    game.generateQuestion();
    console.log(game.currentQuestion);

    //Attach click handler to each box
    var boxes = $('.color-box');
    for(var i = 0; i < boxes.length; i++) {
      $(boxes[i]).click(function() {
        if($(this).attr('id') == game.currentQuestion.brightestColorIndex) {
          console.log("That's right!");
          game.numberCorrect++;
          game.correctlyAnswered.push(game.currentQuestion.colors);
          // console.log(game.correctlyAnswered);
        }
        else {
          console.log("Try again...");
          game.incorrectlyAnswered.push(game.currentQuestion.colors);
        }
        //Increment # of questions asked
        game.questionsAnswered++;

        //Create the next question if there are still more to go
        if(game.questionsAnswered < game.numberOfQuestions) {
          game.generateQuestion();
          // console.log(game.currentQuestion);
        }
        //Or show results if all questions have been asked
        else {
          game.displayResults();
        }
      })
    }
  });

  $('#btn-newGame').click(resetGame);
})

function createBoxes(numColors) {
  for(var i = 0; i < numColors; i++) {
    var newBox = $('<div></div>').addClass('color-box').attr('id', i.toString());
    $('.color-box-container').append(newBox);
  }
}

function generateQuestion(numColors) {
  var question = {};
  var colors = [];
  var brightestColorIndex;
  var brightestLValue = 0;

  for(var i = 0; i < numColors; i++) {
    var h = Math.random()*360;
    var s = Math.random()*100;
    var l = Math.random()*100;

    if(l > brightestLValue) {
      brightestColorIndex = i;
      brightestLValue = l;
    }

    colors[i] = "hsl(" + h + "," + s + "%," + l + "%)";
  }

  question.colors = colors;
  question.brightestColorIndex = brightestColorIndex;
  return question;
}

function Game(numQuestions, numColors) {
  this.numberOfQuestions = numQuestions;
  this.numberOfColors = numColors;
  this.numberCorrect = 0;
  this.questionsAnswered = 0;
  this.currentQuestion;
  this.correctlyAnswered = [];
  this.incorrectlyAnswered = [];

  this.generateQuestion = function generateQuestion() {
    var question = {};
    var colors = [];
    var brightestColorIndex;
    var brightestLValue = 0;

    for(var i = 0; i < this.numberOfColors; i++) {
      var h = Math.random()*360;
      var s = Math.random()*100;
      var l = Math.random()*100;

      if(l > brightestLValue) {
        brightestColorIndex = i;
        brightestLValue = l;
      }

      colors[i] = "hsl(" + h + "," + s + "%," + l + "%)";
    }

    question.colors = colors;
    question.brightestColorIndex = brightestColorIndex;

    this.currentQuestion = question;
    setBackgroundColors(this.currentQuestion.colors);
  }

  this.displayResults = function() {
    //Hide the game container
    $('#game-container').addClass('hidden');

    //Build endgame results and show them
    $('#game-results').text("You got " + this.numberCorrect + ' out of ' + this.numberOfQuestions + ' right.');
    makeAnswersList(this.correctlyAnswered, $('#correct-answer-list'));
    makeAnswersList(this.incorrectlyAnswered, $('#incorrect-answer-list'));

    $('#endgame-container').removeClass('hidden');
  }
}

function setBackgroundColors(colors) {
  var boxes = $('.color-box');
  for(var i = 0; i < boxes.length; i++) {
    $(boxes[i]).css('backgroundColor', colors[i]);
  }
}

function makeAnswersList(answers, list) {
  for(var i = 0; i < answers.length; i++) {
    var colorGroup = answers[i];
    var colorGroupContainer = $("<div class='color-group-container'></div>").appendTo(list);
    for(var j = 0; j < colorGroup.length; j++) {
      var colorBox = $("<div></div>").appendTo(colorGroupContainer);
      colorBox.addClass('color-box');
      colorBox.css('backgroundColor', colorGroup[j]);
      // console.log(colorGroup[j]);
    }
  }
}

function checkUserInput() {
  var numQuestionsInput = parseInt($('#input-numQuestions').val());
  var numColorsInput = parseInt($('#input-numColors').val());

  var numQuestionsInputInvalid = isNaN(numQuestionsInput) || (numQuestionsInput < 0) || (numQuestionsInput > 20);
  var numColorsInputInvalid = isNaN(numColorsInput) || (numColorsInput < 2) || (numColorsInput > 5);

  if(numQuestionsInputInvalid) {
    $('#numQuestions-error').removeClass('hidden');
    $('#btn-startGame').addClass('hidden');
  }
  else {
    $('#numQuestions-error').addClass('hidden');
    if(!numColorsInputInvalid) $('#btn-startGame').removeClass('hidden');
  }

  if(numColorsInputInvalid) {
    $('#numColors-error').removeClass('hidden');
    $('#btn-startGame').addClass('hidden');
  }
  else {
    $('#numColors-error').addClass('hidden');
    if(!numQuestionsInputInvalid) $('#btn-startGame').removeClass('hidden');
  }
}

function resetGame() {
  //Remove color box containers from the actual game and results
  $('.color-box-container').empty();
  $('#correct-answer-list').empty();
  $('#incorrect-answer-list').empty();

  $('#endgame-container').addClass('hidden');
  $('#startgame-container').removeClass('hidden');
}
