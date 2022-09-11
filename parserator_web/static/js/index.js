/* TODO: Flesh this out to connect the form to the API and render results
   in the #address-results div. */

window.onload = setSubmitBtnListener;

function setSubmitBtnListener() {
   // set up listener for a form submit event
   const form = document.querySelector('form');
   form.addEventListener('submit', event => {
      event.preventDefault();
      submitClicked();
   });
}

function submitClicked() {

   //get address text
   const address = document.querySelector("#address").value; //should get address string

   if (address.trim() == '') {
      displayError('No input detected. Please enter an address to parse.');
      return;
   }

   //send address to parser
   fetch("/api/parse/?" + new URLSearchParams({address:address}).toString())
      .then(response => {
         response.json()
            .then(data => {
               if (response.ok){
                  populateResults(data);
               }
               else {
                  displayError(data['detail'])
               }
            });
      })
      .catch(err => {
         displayError("There was a problem accessing the parser.")
      })
}

function populateResults(data) {

   // make sure results div is visible
   setVisible("results");
   
   const span = document.getElementById("parse-type")
   span.innerHTML = data['address_type']
   
   const table = document.querySelector('table');
   //clear the table
   table.innerHTML = '';

   for (component in data["address_components"]) {
      let row = table.insertRow();
      let val = row.insertCell(0);
      val.innerHTML = data["address_components"][component];
      let part = row.insertCell(1);
      part.innerHTML = component;
   }
}

function displayError(message) {
   const span=document.getElementById("error");
   span.innerHTML = message;
   setVisible("error");
}

function setVisible(type) {
   // Toggles between the results div and the error div being visible.
   // Argument is a string ('results' or 'error') corresponding to which 
   // div to set visible. The other is automatically hidden.

   const results_div = document.getElementById("address-results");
   const error_div = document.getElementById("error-display");

   if (type == 'results') {
      results_div.style.display = "block";
      error_div.style.display = "none";
      }
   else if (type == 'error') {
      results_div.style.display = "none";
      error_div.style.display = "block";
   }
}
