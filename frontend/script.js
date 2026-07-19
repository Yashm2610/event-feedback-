document.addEventListener('DOMContentLoaded', () => {
    
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('formMessage');
    const feedbackItemsContainer = document.getElementById('feedbackItems');

    // Auto-select event from URL parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    const eventParam = urlParams.get('event');
    if (eventParam) {
        const eventSelect = document.getElementById('event');
        if (eventSelect) {
            // Find option that includes the parameter text to be flexible
            Array.from(eventSelect.options).forEach(option => {
                if (option.value.includes(eventParam) || eventParam.includes(option.value)) {
                    eventSelect.value = option.value;
                }
            });
        }
    }

    // Load feedback if we are on the feedback page
    if (feedbackItemsContainer) {
        fetchFeedback();
    }

    // Handle form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const event = document.getElementById('event').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !event || !message) {
                showMessage('error', 'Please fill in all fields.');
                return;
            }

            try {
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, event, message })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('success', 'Feedback submitted successfully! Thank you.');
                    feedbackForm.reset();
                    fetchFeedback(); // Refresh the list
                } else {
                    showMessage('error', data.error || 'Failed to submit feedback.');
                }
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showMessage('error', 'An error occurred while connecting to the server.');
            }
        });
    }

    // Function to display messages
    function showMessage(type, text) {
        formMessage.textContent = text;
        formMessage.className = `message-box ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            formMessage.className = 'message-box';
            formMessage.textContent = '';
        }, 5000);
    }

    // Function to fetch and display feedback
    async function fetchFeedback() {
        try {
            const response = await fetch('/api/feedback');
            const data = await response.json();

            if (response.ok && data.feedback) {
                displayFeedback(data.feedback);
            } else {
                feedbackItemsContainer.innerHTML = '<p style="color: var(--text-secondary);">No feedback found.</p>';
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            feedbackItemsContainer.innerHTML = '<p style="color: #ef4444;">Error loading feedback.</p>';
        }
    }

    // Function to render feedback items
    function displayFeedback(feedbackArray) {
        if (feedbackArray.length === 0) {
            feedbackItemsContainer.innerHTML = '<p style="color: var(--text-secondary);">Be the first to submit feedback!</p>';
            return;
        }

        feedbackItemsContainer.innerHTML = '';
        
        feedbackArray.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute:'2-digit'
            });

            const feedbackEl = document.createElement('div');
            feedbackEl.className = 'feedback-item';
            
            feedbackEl.innerHTML = `
                <div class="meta">
                    <strong>${escapeHTML(item.name)}</strong> on <span style="color: var(--primary-color)">${escapeHTML(item.event)}</span>
                    <span style="float: right;">${date}</span>
                </div>
                <p>${escapeHTML(item.message)}</p>
            `;
            
            feedbackItemsContainer.appendChild(feedbackEl);
        });
    }

    // Helper to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
