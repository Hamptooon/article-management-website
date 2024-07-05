class helper{
    formatDate(timestamp){
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`;
    };

    getFilterArticlesByTime(articles, filterTimeValue){
        return articles.filter(article => {
            const currentTime = new Date();
            const articleTime = new Date(article.created_time);
            return (currentTime - articleTime) <= filterTimeValue;
        });
    };
}

module.exports = new helper();
