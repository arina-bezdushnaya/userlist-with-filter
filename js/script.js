const userlistDisplayed = document.querySelector("tbody");
const buttonReset = document.querySelector("button");
const form = document.querySelector("form");
const indicator = document.querySelector(".loading-indicator");
const filter = document.querySelector(".filter");
const userTable = document.querySelector(".wrapper");
const filterNameInput = document.querySelector("input");



//creates an instance of user-object with required information
const person = class User {
  constructor(user) {
    this.username = `${user.name.first} ${user.name.last}`;
    this.userPictureThumbnail = user.picture.thumbnail;
    this.userPictureTooltip = user.picture.large;
    this.userLocation = `${user.location.state} ${user.location.city}`;
    this.userEmail = user.email;
    this.userPhone = user.phone;
    this.userRegisteredDate = new Date(user.registered.date).toLocaleDateString();
  }
}

//get data from server, return object in json format
const getUserlist = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/?results=15');
    const json = await response.json();
    return json.results;
  } catch (error) {
    console.log('Error:', error);
  }
}


// the decorator makes it possible to avoid unnecessary rerenders when typing in the filtering field
function debounce(func, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, wait);
  };
}


//create an array of users only with nessesary info about them
//and pass an array to filter and display function as parameter
const  fillUserlistRequiredInfo = async ()=> {
  const userData = await getUserlist();
  const userlist = [];
  userData.forEach(user => {
    const userInfo = new person(user);
    userlist.push(userInfo); 
  });

  //pass an initial array and input value to filter
  filterNameInput.addEventListener("keydown", debounce(function(event) {
    event.preventDefault();
    const filterName = filterNameInput.value;
    filterUserlist(userlist, filterName);
  }, 1000));

  //reset input field and display an initial data in the table
  buttonReset.addEventListener("click", function() { 
    displayUserlist(userlist);
    filterNameInput.value = "";
  });

  //pass an initial array to display
  displayUserlist(userlist);
};


//insert info about all users into the table
const displayUserlist = (userlist) => {
  userlistDisplayed.innerHTML = "";
  userlist.forEach(user => {
    const tableRow = userlistDisplayed.appendChild(document.createElement("tr"));
    const usernameInsert = tableRow.appendChild(document.createElement("td"));
    const userPictureInsert = tableRow.appendChild(document.createElement("td"));
    const userPictureThumbnail = userPictureInsert.appendChild(document.createElement("img"));
    const userPictureTooltip = userPictureInsert.appendChild(document.createElement("img"));
    const userLocationInsert = tableRow.appendChild(document.createElement("td"));
    const userEmailInsert = tableRow.appendChild(document.createElement("td"));
    const userPhoneInsert = tableRow.appendChild(document.createElement("td"));
    const userRegisteredDateInsert = tableRow.appendChild(document.createElement("td"));
    
    usernameInsert.innerHTML = user.username;
    userPictureThumbnail.src = user.userPictureThumbnail;
    userPictureTooltip.src = user.userPictureTooltip;
    userPictureTooltip.className = "tooltip";
    userLocationInsert.innerHTML = user.userLocation;
    userEmailInsert.innerHTML = user.userEmail;
    userPhoneInsert.innerHTML = user.userPhone;
    userRegisteredDateInsert.innerHTML = user.userRegisteredDate;
  
    //pass image elements to the tooltip as parameters
    showTooltip(userPictureThumbnail, userPictureTooltip);
  })
};


// data from server load fast enough so add artificial delay to show loading indicator
// and then show data in the table
window.addEventListener("load", function() {
  fillUserlistRequiredInfo();
    this.setTimeout(() => {
    indicator.style.display = "none";
    userTable.style.display = "block";
  }, 1000);
});


// error appears when filter found nothing
const showError = () => {
  const errorMessage = userlistDisplayed.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
  errorMessage.colSpan = "6";
  errorMessage.className = "error-message";
  errorMessage.innerHTML = "Nothing Found";
}

// implement filter by username
// filter takes an initial array and input value and then table is updated
const filterUserlist = (userlist, filterName) => {
  const filteredList = userlist.filter(user => user.username.toLowerCase().indexOf(filterName) != -1)
  displayUserlist(filteredList);

  if(filteredList.length === 0) {
    showError();
  }
};


// tooltip appears when you hover your cursor over a thumbnail and dissappear when mouse is out
const showTooltip = (userPictureThumbnail, userPictureTooltip) => {
  userPictureThumbnail.onmouseover =  function() {
    userPictureTooltip.style.visibility = "visible";
  };
  userPictureThumbnail.onmouseout =  function() {
    userPictureTooltip.style.visibility = "hidden";
  };
}
