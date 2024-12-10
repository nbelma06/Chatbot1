const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

function sendMessage() {
    const userMessage = chatInput.value;
    if (userMessage.trim() === '') return;

    displayMessage(userMessage, 'user');
    chatInput.value = '';

    // Send the message to OpenAI API
    callAI(userMessage);
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (sender === 'user') messageElement.classList.add('user');
    if (sender === 'bot-message') messageElement.classList.add('bot-message');
    messageElement.textContent = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function callAI(userMessage) {
    displayMessage('Typing...', 'bot-message');

    fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY_HERE`
        },
        body: JSON.stringify({
            prompt: `You are a chatbot helping users find Black-Owned Businesses in Brooklyn. Respond to: "${userMessage}"`,
            max_tokens: 100
        })
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.choices[0].text;
        displayMessage(botMessage, 'bot-message');
    })
    .catch(() => {
        displayMessage('Sorry, something went wrong.', 'bot-message');
    });
}
