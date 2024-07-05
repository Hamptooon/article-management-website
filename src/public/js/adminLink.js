document.addEventListener('DOMContentLoaded', () => {
    const adminLink = document.getElementById('admin-link');
    adminLink.addEventListener('click', async (event) => {
        const token =  localStorage.getItem('token');
        console.log(token);
        try {
            const response = await fetch('/admin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token

                },
            });

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });
});