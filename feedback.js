const feedbackForm = document.getElementById('feedback-form');
const feedbackMessage = document.getElementById('feedback-message');

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const rating = document.querySelector(
    'input[name="rating"]:checked'
  )?.value;
  const message = document.getElementById('message').value.trim();

  if (!category || !rating || !message) {
    feedbackMessage.textContent = 'Please fill all fields.';
    feedbackMessage.className = 'error';
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/feedback',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          category,
          rating: Number(rating),
          message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    feedbackMessage.textContent =
      'Thank you! Your feedback has been submitted successfully.';

    feedbackMessage.className = 'success';

    feedbackForm.reset();

  } catch (error) {

    console.error(error);

    feedbackMessage.textContent =
      'Unable to submit feedback. Please try again.';

    feedbackMessage.className = 'error';
  }
});