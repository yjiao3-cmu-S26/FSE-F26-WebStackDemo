/*
  TODO 5 — Fetch Demo

  This file is ONLY for the API request demonstration.
  It intentionally uses standard browser JavaScript
  instead of jQuery so the Fetch example stays separate.

  Task:
  1. Send a GET request to /api/hello.
  2. Convert the response to JSON.
  3. Display data.message in #api-message.
*/


const apiButton = document.querySelector('#api-btn');

apiButton.addEventListener('click', async function () {

  // TODO:
  // 1. fetch('/api/hello')
  // 2. await response.json()
  // 3. update #api-message

});


/*
  Axios Alternative
  -----------------

  The demo above uses Fetch.

  The equivalent Axios implementation would be:

  const apiButton = document.querySelector('#api-btn');

  apiButton.addEventListener('click', async function () {

    const response = await axios.get('/api/hello');

    document.querySelector('#api-message').textContent =
      response.data.message;

  });


  Compare:

  Fetch:
    const response = await fetch('/api/hello');
    const data = await response.json();
    data.message

  Axios:
    const response = await axios.get('/api/hello');
    response.data.message


  Fetch is built into modern browsers.
  Axios is an external library.
*/
