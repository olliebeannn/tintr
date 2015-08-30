$(document).ready(function() {
  //Take user input to set up game
  var numQuestions;
  var numColors;

  $('#input-numQuestions, #input-numColors').blur(checkUserInput);

  $('#btn-startGame').click(function() {
    numQuestions = $('#input-numQuestions').val();
    // console.log(numQuestions);
    numColors = $('#input-numColors').val();
    // console.log(numColors);

    //Create a game with a number of questions, right and wrong answers
    var game = new Game(numQuestions);
    $('#game-container').removeClass('hidden');

    //Create number of color boxes based on input
    createBoxes(numColors);

    //Generate set of colors for question, and save index of lightest one
    var question = generateQuestion(numColors);
    setBackgroundColors(question.colors);
    console.log(question);

    //Attach click handler to each box
    var boxes = $('.color-box');
    for(var i = 0; i < boxes.length; i++) {
      $(boxes[i]).click(function() {
        if($(this).attr('id') == question.brightestColorIndex) {
          console.log("That's right!");
          game.numberCorrect++;
          game.correctlyAnswered.push(question.colors);
          console.log(game.correctlyAnswered);
        }
        else {
          console.log("Try again...");
          game.incorrectlyAnswered.push(question.colors);
        }
        //Increment # of questions asked
        game.questionsAnswered++;

        //Create the next question if there are still more to go
        if(game.questionsAnswered < game.numberOfQuestions) {
          question = generateQuestion(numColors);
          setBackgroundColors(question.colors);
          console.log(question);
        }
        else {
          // $('body').append('<p>Game over!<p>');
          game.displayResults();
        }
      })
    }
  });
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

function setBackgroundColors(colors) {
  var boxes = $('.color-box');
  for(var i = 0; i < boxes.length; i++) {
    $(boxes[i]).css('backgroundColor', colors[i]);
  }
}

function Game(numQuestions) {
  this.numberOfQuestions = numQuestions;
  this.numberCorrect = 0;
  this.questionsAnswered = 0;
  this.correctlyAnswered = [];
  this.incorrectlyAnswered = [];

  this.displayResults = function() {
    //Hide the game container
    $('#game-container').addClass('hidden');

    //Build endgame results and show them
    $('#game-results').text("You got " + this.numberCorrect + ' out of ' + this.numberOfQuestions + ' right.');
    for(var i = 0; i < this.correctlyAnswered.length; i++) {
      var colorGroup = this.correctlyAnswered[i];
      var colorGroupContainer = $("<div class='color-group-container'></div>").appendTo($('#correct-answer-list'));
      for(var j = 0; j < colorGroup.length; j++) {
        var colorBox = $("<div></div>").appendTo(colorGroupContainer);
        colorBox.addClass('color-box');
        colorBox.css('backgroundColor', colorGroup[j]);
        console.log(colorGroup[j]);
      }
    }

    $('#endgame-container').removeClass('hidden');
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
