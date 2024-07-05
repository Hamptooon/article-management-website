document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('article-modal');
    const closeModal = document.querySelector('.close');
    const modalContent = document.getElementById('modal-article-content');

    const showModal = (article) => {
        modalContent.innerHTML = `
            <h2>${article.title}</h2>
            <img src="/img/${article.image_path}" alt="${article.title}">
            <p>${article.description}</p>
            <div>${article.content}</div>
            <p><strong>Категория:</strong> ${article.categoryTitle}</p>
            <p><strong>Дата создания:</strong> ${article.created_time}</p>
        `;
        modal.style.display = 'block';
    };

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('click', async (event) => {
            event.preventDefault();
            const articleId = card.getAttribute('data-article-id');
            
            try {
                const response = await fetch(`/article/${articleId}`);
                const data = await response.json();
                
                if (data.success) {
                    showModal(data.article);
                } else {
                    console.error('Failed to load article:', data.message);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        });
    });
});
