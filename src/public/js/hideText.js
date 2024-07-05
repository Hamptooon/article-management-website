document.addEventListener('DOMContentLoaded', () => {
    const hideTextBtn = document.getElementById('hide-info');
    const hideText = document.querySelector('.info-section__text');

    hideTextBtn.addEventListener("click", () => hideText.classList.toggle("hide"));
    
});
