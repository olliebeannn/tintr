$(document).ready(function() {
  // var box1 = $('#box1');
  // var box2 = $('#box2');
  //
  // box1.css('backgroundColor', generateColor());
  // box2.css('backgroundColor', generateColor());

  //Create a game with a number of questions, right and wrong answers
  var game = new Game(5);

  //Create number of color boxes based on input
  var numBoxes = 2;
  createBoxes(numBoxes);

  //Generate set of colors for question, and save index of lightest one
  var question = generateQuestion(numBoxes);
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
        question = generateQuestion(numBoxes);
        setBackgroundColors(question.colors);
        console.log(question);
      }
      else {
        $('body').append('<p>Game over!<p>');
      }
    })
  }
})

function createBoxes(numBoxes) {
  for(var i = 0; i < numBoxes; i++) {
    var newBox = $('<div></div>').addClass('color-box').attr('id', i.toString());
    $('.container').append(newBox);
  }
}

function generateQuestion(numBoxes) {
  var question = {};
  var colors = [];
  var brightestColorIndex;
  var brightestLValue = 0;

  for(var i = 0; i < numBoxes; i++) {
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
}
