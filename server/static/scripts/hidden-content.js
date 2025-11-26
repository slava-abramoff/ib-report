const role = localStorage.getItem('role');
const userList = document.getElementById('userslist');

function hiddenListItem() {
  if (role !== 'admin') {
    userList.classList.add('hidden'); // добавляем класс hidden
  } else {
    userList.classList.remove('hidden'); // на всякий случай, если нужно показать
  }
}

hiddenListItem();
