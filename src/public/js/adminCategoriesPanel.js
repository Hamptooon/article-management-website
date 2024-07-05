document.addEventListener('DOMContentLoaded', () => {
    const operationSelect = document.getElementById('operation-select');
    const addForm = document.getElementById('add-form');
    const changeForm  = document.getElementById('change-form');
    const editForm = document.getElementById('edit-form');

    const responseMessage = document.getElementById('response-message');
    const showForm = (form) => {
        addForm.style.display = 'none';
        editForm.style.display = 'none';
        changeForm.style.display = 'none';
        if (form === 'add') {
            addForm.style.display = 'block';
        } else if (form === 'delete') {
            changeForm.style.display = 'block';
        } else if(form == 'edit'){
            editForm.style.display = 'block';
        }
        
    };

    operationSelect.addEventListener('change', () => {
        showForm(operationSelect.value);
    });

    addForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        handleSubmit(addForm, `/admin/categories/add`);
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        handleSubmit(editForm, `/admin/categories/edit`);
    });

    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-id');
            handleDelete(categoryId);
            
        });
    });


    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', async () => {
            const categoryId = button.getAttribute('data-id');
            const category = await fetchCategoryData(categoryId);
            populateEditForm(category);
            showForm('edit');
        });
    });

    const populateEditForm = (category) => {
        if (!category) return;
        document.getElementById('edit-category-id').value = category.id;
        document.getElementById('edit-title').value = category.title;
    };

    const handleSubmit = async (form, url) => {
        const isEditForm = form.id === 'edit-form';
        const method = isEditForm ? 'PUT' : 'POST';
        const formData = new FormData(form);
        console.log(form.id);
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            const result = await response.json();
            responseMessage.style.display = 'block';
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.success ? 'green' : 'red';
            if (result.success) {
                form.reset();
            }
        } catch (error) {
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = result.message;
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/admin/categories/del/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            responseMessage.style.display = 'block';
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.success ? 'green' : 'red';
            if (result.success) {
                document.querySelector(`button[data-id="${id}"]`).closest('.item-row').remove();
            }
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000); 
        } catch (error) {
            console.log(error.message);
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = 'Ошибка сервера';
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        }
    };

    const fetchCategoryData = async (id) => {
        try {
            const response = await fetch(`/admin/categories/${id}`);
            const data =  await response.json();
            console.log(data);
            return data.category;
        } catch (error) {
            console.error('Error fetching article data:', error);
            return null;
        }
    };





});
