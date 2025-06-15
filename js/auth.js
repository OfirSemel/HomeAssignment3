//  הרשמה והתחברות (usersList, currentUser)


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('Login attempt for:', username);
    console.log('Users in storage:', getUsersList());
    
    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    const user = validateUserCredentials(username, password);
    console.log('User found:', user);
    
    if (user) {
        setCurrentUser(username);
        alert('LOGIN SUCCESS! \n\nWelcome ' + username + '!');
        window.location.replace('index.html');
    } else {
        showError('Invalid username or password. User not registered.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password.length < 8) {
        showError('Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (checkUserExists(username)) {
        showError('Username already exists. Please choose a different username.');
        return;
    }
    
    console.log('Before saving user:', getUsersList());
    addUserToList(username, password);
    console.log('After saving user:', getUsersList());
    
    alert(' REGISTRATION SUCCESS! \n\nUser "' + username + '" has been registered successfully!\n\nYou can now log in with your credentials.');
    
    showSuccess('Account created successfully! Redirecting to login...');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        clearCurrentUser();
        window.location.href = 'login.html';
    }
}