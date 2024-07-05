document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.category-link');
    const allArticlesLink = document.getElementById('all-articles-link');
    const articlesSection = document.getElementById('articles-section');
    const filterSelect = document.getElementById('filter-select');
    const showAllBtn = document.getElementById('show-all');

    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const monthMs = 31 * dayMs;
    const yearMs = 12 * monthMs;
    
    let articlesData = []; 
    let currentCategoryId = null;

    
    const displayArticles = (articles) => {
        articlesSection.innerHTML = ''; 

        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.classList.add('article-card');
            articleCard.setAttribute('data-category', article.category_id);
            articleCard.setAttribute('data-article-id', article.id);

            articleCard.innerHTML = `
                <div class = "article-category">${article.categoryTitle}</div>
                <h3 class = "article-title">${article.title}</h3>
                <img src="/img/articles/${article.image_path}" alt="${article.title}">
                
                <div class = "article-description">${article.description}</div>
                <div class = "article-time">${article.created_short_time}</div>
            `;
            articlesSection.appendChild(articleCard);

            articleCard.addEventListener('click', async (event) => {
                event.preventDefault();
                const articleId = articleCard.getAttribute('data-article-id');

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
    };
    const showModal = (article) => {
        const modal = document.getElementById('article-modal');
        const modalContent = document.getElementById('modal-article-content');

        modalContent.innerHTML = `
            <div class = "article-info">
                <div class = "article-category-title">${article.categoryTitle}</div>
                <div class = "article-time">${article.created_short_time}</div>
            </div>
            <h2 class = "article-title">${article.title}</h2>
            <img src="/img/articles/${article.image_path}" alt="${article.title}">
            <div class = "article-description">${article.description}</div>
            <div class = "article-content">${article.content}</div>
        `;
        modal.style.display = 'block';

        const closeModal = document.querySelector('.close');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    };

    const getFilteredArticlesByTime = (articles, filterTimeValue) => {
        return articles.filter(article => {
            const currentTime = new Date();
            const articleTime = new Date(article.created_time);
            return (currentTime - articleTime) <= filterTimeValue;
        });
    };

    const applyFilter = () => {
        const selectedValue = filterSelect.value;
        let filteredArticles = articlesData;

        if (selectedValue === '24') {
            filteredArticles = getFilteredArticlesByTime(filteredArticles, dayMs);
        } else if (selectedValue === 'week') {
            filteredArticles = getFilteredArticlesByTime(filteredArticles, weekMs);
        } else if (selectedValue === 'month') {
            filteredArticles = getFilteredArticlesByTime(filteredArticles, monthMs);
        } else if (selectedValue === 'year') {
            filteredArticles = getFilteredArticlesByTime(filteredArticles, yearMs);
        }

        displayArticles(filteredArticles);
    };
    const resetActiveCategory = () => {
        categoryLinks.forEach(link => {
            link.classList.remove('active');
        });
    };
    categoryLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            event.target.classList.toggle("active");
            currentCategoryId = link.getAttribute('data-category-id');
            
            try {
                const response = await fetch(`/articles/${currentCategoryId}`);
                const data = await response.json();

                if (data.success) {
                    articlesData = data.articles;
                    applyFilter(); 


                    resetActiveCategory();
                    link.classList.add('active');
                } else {
                    console.error('Failed to load articles:', data.message);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        });
    });

    allArticlesLink.addEventListener('click', async (event) => {
        event.preventDefault();
        currentCategoryId = null;

        try {
            const response = await fetch('/articles');
            const data = await response.json();

            if (data.success) {
                articlesData = data.articles;
                applyFilter(); 
            } else {
                console.error('Failed to load articles:', data.message);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    });

    filterSelect.addEventListener('change', applyFilter);
    showAllBtn.addEventListener('click', () => displayArticles(articlesData));
    showAllBtn.addEventListener('click', () => filterSelect.value = "all");
    

    const fetchData = async () => {
        try {
            const response = await fetch('/articles');
            const data = await response.json();
            articlesData = data.articles;
            displayArticles(articlesData);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    fetchData();
});
