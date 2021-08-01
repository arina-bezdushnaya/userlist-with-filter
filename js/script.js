const userlist = document.querySelector("tbody");
const buttonReset = document.querySelector("button");
const form = document.querySelector("form");
const indicator = document.querySelector(".loading-indicator");
const filter = document.querySelector(".filter");
const userTable = document.querySelector(".wrapper");



//creates an instance of user-object with requried information
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
    return json;
  } catch (error) {
    console.log('Error:', error);
  }
}


//use json object to separate an array included all users
//create an instance for all array elements and insert user info into html-tags
async function displayUserlist(){

  const users = await getUserlist();

  users.results.forEach(user => {
    let userInfo = new person(user);
    const trCreate = userlist.appendChild(document.createElement("tr"));

    const usernameInsert = trCreate.appendChild(document.createElement("td"));
    usernameInsert.innerHTML = userInfo.username;

    const userPictureInsert = trCreate.appendChild(document.createElement("td")).appendChild(document.createElement("img"));
    userPictureInsert.src = userInfo.userPicture;

    const userLocationInsert = trCreate.appendChild(document.createElement("td"));
    userLocationInsert.innerHTML = userInfo.userLocation;

    const userEmailInsert = trCreate.appendChild(document.createElement("td"));
    userEmailInsert.innerHTML = userInfo.userEmail;

    const userPhoneInsert = trCreate.appendChild(document.createElement("td"));
    userPhoneInsert.innerHTML = userInfo.userPhone;

    const userRegisteredDateInsert = trCreate.appendChild(document.createElement("td"));
    userRegisteredDateInsert.innerHTML = userInfo.userRegisteredDate;
  });

};


/*add loading indicator,
data from server load fast enough so add artificial delay to show indicator
and then show data in the table*/
window.addEventListener("load", function() {
  displayUserlist();
  this.setTimeout(() => {
    indicator.style.display = "none";
    userTable.style.display = "block";
  }, 1000);
});
