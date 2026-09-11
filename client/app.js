/*
  TODO 4 — jQuery Demo

  This file is ONLY for the jQuery demonstration.

  Goal:
  When #jquery-btn is clicked, change the text in
  #jquery-message.

  Syntax:

  Select:
  $('#element-id')

  Event:
  $('#element-id').on('click', function () {
    // code
  });

  Change text:
  $('#element-id').text('New text');
*/


$('#jquery-btn').on('click', function () {

  // TODO:
  // Use jQuery .text() to change #jquery-message.
  $('#jquery-message').text('Hello from jQuery!');

});
