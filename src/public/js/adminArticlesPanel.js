document.addEventListener('DOMContentLoaded', () => {
    const operationSelect = document.getElementById('operation-select');
    const addForm = document.getElementById('add-form');
    const editForm = document.getElementById('edit-form');
    const changeForm = document.getElementById('change-form');
    const responseMessage = document.getElementById('response-message');
    const contentTextarea = document.getElementById('content');
    const editContentTextarea = document.getElementById('edit-content');

    const showForm = (form) => {
        addForm.style.display = 'none';
        editForm.style.display = 'none';
        changeForm.style.display = 'none';
        if (form === 'add') {
            addForm.style.display = 'block';
        } else if (form === 'delete') {
            changeForm.style.display = 'flex';
        } else if(form == 'edit'){
            editForm.style.display = 'block';
        }
        
    };

    operationSelect.addEventListener('change', () => {
        showForm(operationSelect.value);
    });

    addForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        handleSubmit(addForm, `/admin/articles/add`);
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        handleSubmit(editForm, `/admin/articles/edit`);
    });

    document.querySelectorAll('.edit-article').forEach(button => {
        button.addEventListener('click', async () => {
            const articleId = button.getAttribute('data-id');
            const article = await fetchArticleData(articleId);
            populateEditForm(article);
            showForm('edit');
        });
    });

    document.querySelectorAll('.delete-article').forEach(button => {
        button.addEventListener('click', () => {
            const articleId = button.getAttribute('data-id');
            handleDelete(articleId);
        });
    });

    const handleSubmit = async (form, url) => {
        const isEditForm = form.id === 'edit-form';
        const method = isEditForm ? 'PUT' : 'POST';
        const editorContent = isEditForm ? editQuill.root.innerHTML : quill.root.innerHTML;
        const contentField = isEditForm ? editContentTextarea : contentTextarea;
        contentField.value = editorContent;

        const formData = new FormData(form);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
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
                if (isEditForm) {
                    editQuill.root.innerHTML = '';
                } else {
                    quill.root.innerHTML = '';
                }
            }
        } catch (error) {
            responseMessage.style.display = 'block';
            responseMessage.style.color = 'red';
            responseMessage.textContent = result.message;
            console.log("awdwadwad");
            console.log(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/admin/articles/del/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            responseMessage.style.display = 'block';
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.success ? 'green' : 'red';
            if (result.success) {
                document.querySelector(`button[data-id="${id}"]`).closest('.item-card').remove();
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

    const fetchArticleData = async (id) => {
        try {
            const response = await fetch(`/admin/articles/${id}`);
            const data =  await response.json();
            console.log(data);
            return data.article;
        } catch (error) {
            console.error('Error fetching article data:', error);
            return null;
        }
    };

    const populateEditForm = (article) => {
        if (!article) return;
        document.getElementById('edit-article-id').value = article.id;
        document.getElementById('edit-category_id').value = article.category_id;
        document.getElementById('edit-title').value = article.title;
        document.getElementById('edit-description').value = article.description;
        document.getElementById('edit-is_hidden').value = article.is_hidden;
        editQuill.root.innerHTML = article.content;
    };

    const initializeQuill = (containerId) => {
        const editorContainer = document.getElementById(containerId);
        if (editorContainer) {
            return new Quill(editorContainer, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'bullet' }],
                        ['blockquote'],
                        ['link', 'image', 'video']
                    ]
                }
            });
        }
    };

    const quill = initializeQuill('editor-container');
    const editQuill = initializeQuill('edit-editor-container');
});
