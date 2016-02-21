//This is a comemnt
$(document).ready(function() {
  var game, numQuestions, numColors, gameType;

  $('#btn-play').click(function() {
    $('#title').addClass('hidden');
    $('#subtitle').addClass('hidden');
    $('#btn-play').addClass('hidden');
    $('#section-numQuestions').removeClass('hidden');
  })

  //Get number questions
  $('#input-field-numQuestions').keyup(function() {
    checkInput($('#input-field-numQuestions'), 1, 10, $('#input-button-numQuestions'), $('#input-error-numQuestions'));
  });
  $('#input-button-numQuestions').click(function() {
    numQuestions = $('#input-field-numQuestions').val();
    $('#section-numQuestions').addClass('hidden');
    $('#section-numColors').removeClass('hidden');
    // console.log('numQuestions = ' + numQuestions);
  })

  //Get number of colours
  $('#input-field-numColors').keyup(function() {
    checkInput($('#input-field-numColors'), 2, 4, $('#input-button-numColors'), $('#input-error-numColors'));
  });
  $('#input-button-numColors').click(function() {
    numColors = $('#input-field-numColors').val();
    $('#section-numColors').addClass('hidden');
    $('#section-gameType').removeClass('hidden');
    // console.log('numQuestions = ' + numQuestions);
    // console.log('numColors = ' + numColors);
  })

  $('#gameType-lightness, #gameType-saturation').click(function() {
    gameType = $(this).attr('data-mode');
    $('#section-gameType').addClass('hidden');

    //Create a game with a number of questions, right and wrong answers
    game = new Game(numQuestions, numColors, gameType);
    console.log(game.gameType);
    $('#startgame-container').addClass('hidden');
    $('#game-container').removeClass('hidden');

    if(game.gameType == 'lightness') $('#instructions').text("Choose the lightest color.");
    if(game.gameType == 'saturation') $('#instructions').text("Choose the most saturated color.");

    //Create number of color swatches based on input, set question label
    createSwatches(game.numColors);

    //Create game indicators
    for(var i = 0; i < game.numQuestions; i++) {
      var indicator = $('<div></div>').addClass("question-indicator");
      $('#question-indicators').append(indicator);
    }

    //Generate next question
    game.generateQuestion();
    console.log(game.currentQuestion);

    //Attach click handler to each swatch
    var swatches = $('.swatch');
    for(var i = 0; i < swatches.length; i++) {
      $(swatches[i]).click(function() {
        if($(this).attr('id') == game.currentQuestion.correctAnswerIndex) {
          console.log("That's right!");
          // $(this).addClass('swatch-correct');
          // console.log($('.question-indicator')[game.questionsAnswered]);
          $($('.question-indicator')[game.questionsAnswered]).addClass('question-indicator-correct');
          game.numberCorrect++;
          game.correctlyAnswered.push(game.currentQuestion.colors);
        }
        else {
          console.log("Try again...");
          $($('.question-indicator')[game.questionsAnswered]).addClass('question-indicator-incorrect');
          game.incorrectlyAnswered.push(game.currentQuestion.colors);
        }
        //Increment # of questions asked
        game.questionsAnswered++;

        //Create the next question if there are still more to go
        if(game.questionsAnswered < game.numQuestions) {
          game.generateQuestion();
          console.log(game.currentQuestion);
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

$(window).resize(function() {
    resizeSwatches();
});

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

function Game(numQuestions, numColors, gameType) {
  this.numQuestions = numQuestions;
  this.numColors = numColors;
  this.gameType = gameType
  this.numberCorrect = 0;
  this.questionsAnswered = 0;
  this.currentQuestion;
  this.correctlyAnswered = [];
  this.incorrectlyAnswered = [];

  this.generateQuestion = function generateQuestion() {
    var question = {};
    var colors = [];
    var correctAnswerIndex;
    var highestValue = 0;

    for(var i = 0; i < this.numColors; i++) {
      var h = Math.random()*360;
      var s = Math.random()*100;
      var l = Math.random()*100;

      if(this.gameType == 'lightness') {
        console.log('lightness mode question');
        if(l > highestValue) {
          correctAnswerIndex = i;
          highestValue = l;
        }
      }
      else if(this.gameType == 'saturation') {
        console.log('saturation mode question');
        if(s > highestValue) {
          correctAnswerIndex = i;
          highestValue = s;
        }
      }
      colors[i] = "hsl(" + h + "," + s + "%," + l + "%)";
    }

    question.colors = colors;
    question.correctAnswerIndex = correctAnswerIndex;

    this.currentQuestion = question;
    setBackgroundColors(this.currentQuestion.colors);
  }

  this.displayResults = function() {
    //Hide the game container, reveal endgame container
    $('#game-container').addClass('hidden');
    $('#endgame-container').removeClass('hidden');

    //Show user results
    var scorePercentage = Math.floor((this.numberCorrect / this.numQuestions) * 100);
    $('#game-results').text(scorePercentage + "% (" + this.numberCorrect + '/' + this.numQuestions + ')');

    // makeAnswersList(this.correctlyAnswered, $('#correct-answer-list'), true);
    // makeAnswersList(this.incorrectlyAnswered, $('#incorrect-answer-list'), false);
  }

  // this.setQuestionCounterLabel = function() {
  //   var labelText = "Question " + (this.questionsAnswered+1) + " / " + this.numQuestions;
  //   $('#question-counter').text(labelText);
  // }
}

function resetGame() {
  //Remove color swatch containers from the actual game and results
  $('.swatch-container').empty();
  $('#correct-answer-list').empty();
  $('#incorrect-answer-list').empty();
  $('#question-indicators').empty();

  $('#endgame-container').addClass('hidden');
  $('#startgame-container').removeClass('hidden');
  $('#section-numQuestions').removeClass('hidden');
  $('#button-startGame').addClass('hidden');
}

function createSwatches(numColors) {
  for(var i = 0; i < numColors; i++) {
    var newSwatch = $('<div></div>').addClass('swatch').attr('id', i.toString());
    $('.swatch-container').append(newSwatch);
  }
  resizeSwatches();
}

function resizeSwatches() {
  //Set swatch height equal to swatch width
  var swatches = $('.swatch');
  var swatchWidth = $(window).width() * 0.4;
  console.log(swatchWidth);

  for(var j = 0; j < swatches.length; j++) {
    $(swatches[j]).css('width', swatchWidth + 'px')
    $(swatches[j]).css('height', swatchWidth + 'px');
  }
}

function setBackgroundColors(colors) {
  var swatches = $('.swatch');
  for(var i = 0; i < swatches.length; i++) {
    $(swatches[i]).css('backgroundColor', colors[i]);
  }
}

// function makeAnswersList(answers, list, left) {
//   for(var i = 0; i < answers.length; i++) {
//     var colorGroup = answers[i];
//     var colorGroupContainer = $("<div></div>").appendTo(list);
//     for(var j = 0; j < colorGroup.length; j++) {
//       var colorSwatch = $("<div></div>").appendTo(colorGroupContainer);
//       colorSwatch.addClass('swatch');
//       colorSwatch.css('backgroundColor', colorGroup[j]);
//       colorSwatch.css('height', colorSwatch.width() + 20);
//     }
//   }
// }
