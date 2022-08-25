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

   //send address to parser
   fetch("/api/parse?" + new URLSearchParams({address:address}).toString())
      .then(response => {
         console.log("we're in the then block")
         console.log(response);
         response.json()
            .then(data => {
               console.log(data);
               populateTable(data);
            });
      })
      .catch(err => {
         console.log("we're in the catch block");
         console.log(err);

      //Handle errors
      })
}
 // send GET request to api/parse/ -- use fetch   <-----NEXT!
 // recieve results back, populate table

function populateTable(data) {
   console.log("populateTable called!");
   console.log(data);

}