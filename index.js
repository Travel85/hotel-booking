async function getGaiaIDs() {
  const url =
    "https://hotels-com-provider.p.rapidapi.com/v2/regions?query=Hamburg&domain=DE&locale=de_DE";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a6ba88dcc7msh7abab1133479e4fp1018bajsn09f22b1f09ef",
      "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    //console.log(result);

    //Handle results array in function
    processGaiaIDs(result);
  } catch (error) {
    // console.error(error);
  }
}

function processGaiaIDs(array) {
  // console.log(array);
  const gaiaIDsArray = array;
  console.log(`function is called!`);
  // Map over the array to extract the gaiaId from each object
  const gaiaIds = gaiaIDsArray.data.map((item) => item.gaiaId);
  gaiaIds.forEach((element) => console.log(element));
  // Now gaiaIds contains all the gaiaId values from the array
  //example ID: 1427
}
//getGaiaIDs();

async function getHotelResults(startDate, endDate) {
  const url = `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=1427&locale=de_DE&checkin_date=${startDate}&sort_order=REVIEW&adults_number=1&domain=DE&checkout_date=${endDate}&children_ages=4%2C0%2C15&lodging_type=HOTEL%2CHOSTEL%2CAPART_HOTEL&price_min=10&star_rating_ids=3%2C4%2C5&meal_plan=FREE_BREAKFAST&page_number=1&price_max=500&amenities=WIFI%2CPARKING&payment_type=PAY_LATER%2CFREE_CANCELLATION&guest_rating_min=8&available_filter=SHOW_AVAILABLE_ONLY`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a6ba88dcc7msh7abab1133479e4fp1018bajsn09f22b1f09ef",
      "X-RapidAPI-Host": "hotels-com-provider.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    //  console.log(result);

    // Calls function to extract hotelName, review, imageUrl and price and create new object
    processHotelResults(result);
  } catch (error) {
    console.error(error);
  }
}

function processHotelResults(array) {
  // console.log(array);

  let hotelElements = {};
  const hotelList = array.properties.map((item) => ({
    hotelName: item.name,
    review: item.reviews.score,
    imageUrl:
      item.propertyImage &&
      item.propertyImage.image &&
      item.propertyImage.image.url
        ? item.propertyImage.image.url
        : "",
    price: item.price.lead.formatted,
  }));
  //console.log(hotelList);

  // Calls function to create DOM elements
  createHotelResults(hotelList);
}

//create the hotelresults in html
function createHotelResults(array) {
  const container = document.querySelector(".container");
  let i = 0;

  array.forEach((element) => {
    if (i < 15) {
      const items = document.createElement("div");
      items.setAttribute("class", "items");

      const name = document.createElement("div");
      name.setAttribute("class", "name");
      name.innerHTML = element.hotelName;
      container.appendChild(items);
      items.appendChild(name);

      const image = document.createElement("div");
      image.setAttribute("class", "image");
      const img = document.createElement("img");
      image.appendChild(img);
      img.src = element.imageUrl;
      items.appendChild(image);

      const details = document.createElement("div");
      details.setAttribute("class", "details");
      const review = document.createElement("div");
      review.setAttribute("class", "review");
      const price = document.createElement("div");
      price.setAttribute("class", "price");
      review.innerHTML = `<b>Review:</b> ${element.review}`;
      price.innerHTML = `<b>Price:</b> ${element.price}`;
      details.appendChild(review);
      details.appendChild(price);
      items.appendChild(details);

      i++;
    }
  });
}

const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const form = document.querySelector("#form");

//get start date and end date
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const startDateValue = startDate.value;
  const endDateValue = endDate.value;

  /*   console.log(`Start Date: ${startDateValue}`);
  console.log(`End Date: ${endDateValue}`); */

  getHotelResults(startDateValue, endDateValue);
});

//clears the DOM results

const reset = document.querySelector("#reset");
form.addEventListener("reset", (e) => {
  e.preventDefault();

  const itemList = document.querySelectorAll(".items");
  //console.log(itemList);

  itemList.forEach((element) => {
    element.remove();
  });
});
