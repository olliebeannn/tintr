$(document).ready(function() {
  var box1 = $('#box1');
  var box2 = $('#box2');

  // console.log(box1.css('backgroundColor'));
  
  box1.css('backgroundColor', generateColor());
  box2.css('backgroundColor', generateColor());
})

generateColor = function() {
  var h = Math.random()*360;
  var s = Math.random()*100;
  var l = Math.random()*100;

  return "hsl(" + h + "," + s + "%," + l + "%)";
}
