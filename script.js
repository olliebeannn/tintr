//This is a comemnt
$(document).ready(function() {
  var game, numQuestions, numColors;

  // $('#input-numQuestions, #input-numColors').blur(checkUserInput);
  //Get number questions
  $('#input-field-numQuestions').keyup(function() {
    checkInput($('#input-field-numQuestions'), 2, 10, $('#input-button-numQuestions'), $('#input-error-numQuestions'));
  });
  $('#input-button-numQuestions').click(function() {
    numQuestions = $('#input-field-numQuestions').val();
    $('#section-numQuestions').addClass('hidden');
    $('#section-numColors').removeClass('hidden');
    // console.log('numQuestions = ' + numQuestions);
  })

  //Get number of colours
  $('#input-field-numColors').keyup(function() {
    checkInput($('#input-field-numColors'), 2, 10, $('#input-button-numColors'), $('#input-error-numColors'));
  });
  $('#input-button-numColors').click(function() {
    numColors = $('#input-field-numColors').val();
    $('#section-numColors').addClass('hidden');
    // console.log('numQuestions = ' + numQuestions);
    // console.log('numColors = ' + numColors);
  })

  $('#btn-startGame').click(function() {
    // var numQuestions = $('#input-numQuestions').val();
    // var numColors = $('#input-numColors').val();

    //Create a game with a number of questions, right and wrong answers
    game = new Game(numQuestions, numColors);
    $('#startgame-container').addClass('hidden');
    $('#game-container').removeClass('hidden');

    //Create number of color boxes based on input, set question label
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
          // $(this).addClass('color-box-correct');
          game.numberCorrect++;
          game.correctlyAnswered.push(game.currentQuestion.colors);
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
  var colOffset = (12 - (numColors * 2)) / 2;
  var colOffsetString = "col-xs-offset-" + colOffset;

  for(var i = 0; i < numColors; i++) {
    var newBox = $('<div></div>').addClass('color-box').addClass('col-xs-2').attr('id', i.toString());
    if(i == 0) {
      newBox.addClass(colOffsetString);
    }
    $('.color-box-container').append(newBox);
  }

  //Set box height equal to box width
  var boxes = $('.color-box');
  var boxWidth = $(boxes[0]).width();
  console.log(boxWidth);

  for(var j = 0; j < boxes.length; j++) {
    $(boxes[j]).css('height', boxWidth + 'px');
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

    this.setQuestionCounterLabel();
  }

  this.displayResults = function() {
    //Hide the game container, reveal endgame container
    $('#game-container').addClass('hidden');
    $('#endgame-container').removeClass('hidden');

    //Build endgame results and show them
    var scorePercentage = Math.floor((this.numberCorrect / this.numberOfQuestions) * 100);
    $('#game-results').text(scorePercentage + "% (" + this.numberCorrect + '/' + this.numberOfQuestions + ')');

    makeAnswersList(this.correctlyAnswered, $('#correct-answer-list'), true);
    makeAnswersList(this.incorrectlyAnswered, $('#incorrect-answer-list'), false);


  }

  this.setQuestionCounterLabel = function() {
    var labelText = "Question " + (this.questionsAnswered+1) + " / " + this.numberOfQuestions;
    $('#question-counter').text(labelText);
  }
}

function setQuestionCounterLabel(game) {
  var labelText = "Question " + (game.questionsAnswered+1) + " / " + game.numberOfQuestions;
  $('#question-counter').text(labelText);
}

function setBackgroundColors(colors) {
  var boxes = $('.color-box');
  for(var i = 0; i < boxes.length; i++) {
    $(boxes[i]).css('backgroundColor', colors[i]);
  }
}

function makeAnswersList(answers, list, left) {
  for(var i = 0; i < answers.length; i++) {
    var colorGroup = answers[i];
    var colorGroupContainer = $("<div class='color-group-container col-xs-12'></div>").appendTo(list);
    for(var j = 0; j < colorGroup.length; j++) {
      var colorBox = $("<div></div>").appendTo(colorGroupContainer);
      colorBox.addClass('color-box').addClass('col-xs-2');
      colorBox.css('backgroundColor', colorGroup[j]);
      colorBox.css('height', colorBox.width() + 20);

      if(j == 0) {
        var colOffset = (6 - colorGroup.length);
        colorBox.addClass('col-xs-offset-' + colOffset);
      }
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

function checkInput(field, rangeLow, rangeHigh, button, error) {
  // console.log("Hi!");
  var val = parseInt(field.val());
  // console.log(val);
  if(isNaN(val)) {
    button.addClass('hidden');
    error.removeClass('hidden');
    error.text('Enter a number, brah.');
  } else if(val < rangeLow || val > rangeHigh) {
    button.addClass('hidden');
    error.removeClass('hidden');
    error.text('Enter a number between ' + rangeLow + ' and ' + rangeHigh + ', brah.');
  } else {
    button.removeClass('hidden');
    error.text('');
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
