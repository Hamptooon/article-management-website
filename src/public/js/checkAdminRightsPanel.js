document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
        fetch('/auth/user', {
            headers: { 'Authorization': token }
        })
        .then(response => response.json())
        .then(user => {
            if (user.role !== 'admin') {
                window.location.href = '/404';
            }
        })
        .catch(err => {
            console.error(err);
            localStorage.removeItem('token');
        });
    }
    else{
        window.location.href = '/auth';
    }
});