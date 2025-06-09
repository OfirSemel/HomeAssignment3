// פונקציות כלליות לעבודה עם localStorage



function getUsersList() {
    const usersList = localStorage.getItem('usersList');
    return usersList ? JSON.parse(usersList) : [];
}


function saveUsersList(usersList) {
    localStorage.setItem('usersList', JSON.stringify(usersList));
}


function addUserToList(username, password) {
    const usersList = getUsersList();
    const newUser = {
        username: username,
        password: password,
        registeredAt: new Date().toISOString()
    };
    usersList.push(newUser);
    saveUsersList(usersList);
    return newUser;
}


function checkUserExists(username) {
    const usersList = getUsersList();
    return usersList.some(user => user.username === username);
}


function validateUserCredentials(username, password) {
    const usersList = getUsersList();
    return usersList.find(user => user.username === username && user.password === password);
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}


function getCurrentUser() {
    return localStorage.getItem('currentUser');
}


function clearCurrentUser() {
    localStorage.removeItem('currentUser');
    console.log('User logged out, currentUser cleared');
}

function isUserLoggedIn() {
    return getCurrentUser() !== null;
}