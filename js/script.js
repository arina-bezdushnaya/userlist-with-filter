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
    this.userPicture = user.picture.thumbnail;
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
    const trCreate = userlistDisplayed.appendChild(document.createElement("tr"));

    const usernameInsert = trCreate.appendChild(document.createElement("td"));
    const userPictureInsert = trCreate.appendChild(document.createElement("td")).appendChild(document.createElement("img"));
    const userLocationInsert = trCreate.appendChild(document.createElement("td"));
    const userEmailInsert = trCreate.appendChild(document.createElement("td"));
    const userPhoneInsert = trCreate.appendChild(document.createElement("td"));
    const userRegisteredDateInsert = trCreate.appendChild(document.createElement("td"));
    
    usernameInsert.innerHTML = user.username;
    userPictureInsert.src = user.userPicture;
    userLocationInsert.innerHTML = user.userLocation;
    userEmailInsert.innerHTML = user.userEmail;
    userPhoneInsert.innerHTML = user.userPhone;
    userRegisteredDateInsert.innerHTML = user.userRegisteredDate;
  
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


// implement filter by username
// filter takes an initial array and input value and then table is updated
const filterUserlist = (userlist, filterName) => {
  const findname = userlist.filter(user => user.username.toLowerCase().indexOf(filterName) != -1);
  displayUserlist(findname);
};
