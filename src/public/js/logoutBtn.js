function logout() {
    console.log("removeToken");
    localStorage.removeItem('token');

    
    window.location.href = '/auth'; 
}

document.getElementById('logout-link').addEventListener('click', logout);
