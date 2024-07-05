document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
        fetch('/auth/user', {
            headers: { 'Authorization': token }
        })
        .then(response => response.json())
        .then(user => {
            if (user.role === 'admin') {
                document.getElementById('admin-link').style.display = 'block';
            }
            document.getElementById('logout-link').style.display = 'block';
        })
        .catch(err => {
            console.log("3333333333333333333");
            console.error(err);
            localStorage.removeItem('token');
        });
    }
    else{
        console.log("11111111111111111111");
        document.getElementById('auth-link').style.display = 'block';
    }
});