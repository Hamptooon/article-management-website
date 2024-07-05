document.addEventListener('DOMContentLoaded', () => {
    const operationSelect = document.getElementById('operation-select');
    const addForm = document.getElementById('add-form');
    const changeForm  = document.getElementById('change-form');
    const responseMessage = document.getElementById('response-message');
  
    
    const showForm = (form) => {
        addForm.style.display = 'none';
        changeForm.style.display = 'none';
        if (form === 'add') {
            addForm.style.display = 'block';
        } else if (form === 'delete') {
            changeForm.style.display = 'block';
        }
    };

    operationSelect.addEventListener('change', () => {
        showForm(operationSelect.value);
    });

    addForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        handleSubmit(addForm, `/admin/users/add`);
    });

    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            handleDelete(userId);
        });
    });

    const handleSubmit = async (form, url) => {

        const formData = new FormData(addForm);
        const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));

        console.log('Username:', formData.get('username'));
        console.log('Email:', formData.get('email'));
        console.log('Password:', formData.get('password'));
        console.log('Role:', formData.get('role'));

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formJSON
            });
            const result = await response.json();
            responseMessage.style.display = 'block';
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.success ? 'green' : 'red';
            if (result.success) {
                form.reset();
            }
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000); 
        } catch (error) {
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = 'Ошибка сервера';
        }
    };



     const handleDelete = async (id) => {
        try {
            const response = await fetch(`/admin/users/del/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            responseMessage.style.display = 'block';
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.success ? 'green' : 'red';
            if (result.success) {
                document.querySelector(`button[data-id="${id}"]`).closest(".item-row").remove();
            }
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        } catch (error) {
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = 'Ошибка сервера';
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000); 
        }
    };


});
