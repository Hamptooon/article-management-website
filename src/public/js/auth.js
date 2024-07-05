document.addEventListener('DOMContentLoaded', () => {
    const loginBlock = document.getElementById('login-block');
    const registerBlock = document.getElementById('register-block');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const registerForm = document.getElementById('register-form');
    const registerButton = registerForm.querySelector('button');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const registerEmail = document.getElementById('register-email');
    
    showRegisterLink.addEventListener('click', () => {
        loginBlock.style.display = 'none';
        registerBlock.style.display = 'flex';
    });
    
    showLoginLink.addEventListener('click', () => {
        registerBlock.style.display = 'none';
        loginBlock.style.display = 'flex';
    });

    registerForm.addEventListener('input', () => {
        if (registerUsername.value.trim() && registerPassword.value.trim() && registerEmail.value.trim()) {
            registerButton.disabled = false;
        } else {
            registerButton.disabled = true;
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: registerUsername.value.trim(),
                email: registerEmail.value.trim(),
                password: registerPassword.value.trim()
            })
        });
        const data = await response.json();
        alert(data.message);
        if (data.success) {
            localStorage.setItem('token', data.token); 
            localStorage.setItem('userId', data.userId); 
    
            window.location.href = '/';
        }
        else{
            window.location.href = '/auth';
        }
    });

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginForm['login-email'].value.trim(),
                password: loginForm['login-password'].value.trim()
            })
        });
        const data = await response.json();
        alert(data.message);
        if (data.success) {
            localStorage.setItem('token', data.token); 
            window.location.href = '/';
            
        }
        else{
            window.location.href = '/auth';
        }
    });
});
