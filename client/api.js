/*
  TODO 5 — Axios Demo

  This file is ONLY for the API request demonstration.
  It intentionally uses standard browser JavaScript
  instead of jQuery so the Axios example stays separate.

  Task:
  1. Send a GET request to /api/hello.
  2. Update the text in #api-message with the response.
  3. In case of an error, update #api-message with the error message.
*/


const apiButton = document.querySelector('#api-btn');

apiButton.addEventListener('click', function () {

  axios.get('/api/hello')
    .then(response => {
      document.querySelector('#api-message').textContent = response.data.message;
    })
    .catch(error => {
      const errorMessage = error.response.data.error;
      document.querySelector('#api-message').textContent = errorMessage;
    });

});
