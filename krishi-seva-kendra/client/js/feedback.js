const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  const message = document.getElementById('message').value.trim();

  if (!category || !rating || !message) {
    feedbackMessage.textContent = 'Please fill all fields.';
    feedbackMessage.style.color = 'red';
    return;
  }

  try {
    await api.post('/feedback', { category, rating: Number(rating), message }, { auth: false });
    feedbackMessage.textContent = 'Thank you! Your feedback has been submitted successfully.';
    feedbackMessage.style.color = 'green';
    feedbackForm.reset();
  } catch (error) {
    feedbackMessage.textContent = 'Unable to submit feedback. Please try again.';
    feedbackMessage.style.color = 'red';
  }
});
