document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const responseMessage = document.getElementById('response-message');
    const token = localStorage.getItem('token');
    console.log(token);
    contactForm.addEventListener('input', () => {
        const isFormValid = contactForm.checkValidity();
        console.log(isFormValid);
        submitBtn.disabled = !isFormValid;
    });

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        
        let userId;
        try {
            const response = await fetch('/auth/user', {
                headers: { 'Authorization': token }
            });
            console.log("Success");
            const user = await response.json();
            console.log(user);
            userId = user.id;
        } catch (err) {
            console.log(err.message);
        }
        
        const formData = new FormData(contactForm);
        formData.append('userId', userId);
        const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
        
        console.log(formJSON);
        try {
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formJSON,
            });

            const result = await response.json();

            if (result.success) {
                responseMessage.textContent = 'Ваша заявка принята. Спасибо за обратную связь!';
                responseMessage.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = true;
            } else {
                responseMessage.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.';
                responseMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            responseMessage.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.';
            responseMessage.style.display = 'block';
        }
    });
});
