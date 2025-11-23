const role = localStorage.getItem("role");
const userList = document.getElementById("userslist");

function hiddenListItem() {
  if (role === "admin") {
    userList.style.display = "block";
  }
}

hiddenListItem();
