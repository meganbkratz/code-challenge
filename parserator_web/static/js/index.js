/* TODO: Flesh this out to connect the form to the API and render results
   in the #address-results div. */

window.onload = setSubmitBtnListener;

// pick up submit button press

function setSubmitBtnListener() {
   console.log("Lookin for buttons");
   const form = document.querySelector('form');
   form.addEventListener('submit', event => {
      event.preventDefault();
      submitClicked();
   });
}

function submitClicked() {
   console.log("Submit button clicked!");
   //get address text

   const address = document.querySelector("#address").value; //should get address string
   console.log("address:", address)

   if (address.trim() == '') {
      displayError('No input detected. Please enter an address to parse.');
      return;
   }

   //send address to parser
   fetch("/api/parse/?" + new URLSearchParams({address:address}).toString())
      .then(response => {
         console.log("we're in the then block")
         console.log(response);
         response.json()
            .then(data => {
               console.log(data);
               if (response.ok){
                  populateResults(data);
               }
               else {
                  displayError(data['detail'])
               }
            });
      })
      .catch(err => {
         console.log("we're in the catch block");
         console.log(err);
         displayError("There was a problem accessing the parser.")

      //Handle errors
      })
}
 // send GET request to api/parse/ -- use fetch   <-----NEXT!
 // recieve results back, populate table

function populateResults(data) {
   console.log("populateResults called!");

   // show results div
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
   console.log("done populating table")
}

function displayError(message) {
   const span=document.getElementById("error");
   span.innerHTML = message;
   setVisible("error");
}

function setVisible(type) {
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
