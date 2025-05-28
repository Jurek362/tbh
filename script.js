// Funkcja pobierająca wiadomości dla danego sluga
async function loadMessages() {
  const slug = document.getElementById('slug').value;
  try {
    const response = await fetch(`/api/messages/${slug}`);
    if (!response.ok) {
      throw new Error("Błąd ładowania wiadomości");
    }
    const data = await response.json();
    renderMessages(data.messages);
  } catch (error) {
    console.error(error);
    document.getElementById('messages').innerHTML = '<p>Wystąpił błąd podczas ładowania wiadomości.</p>';
  }
}

// Funkcja renderująca wiadomości w interfejsie
function renderMessages(messages) {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';
  if (messages.length === 0) {
    messagesContainer.innerHTML = '<p>Brak wiadomości.</p>';
    return;
  }
  messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-box';
    messageDiv.innerHTML = `
      <p>${msg.message}</p>
      <small>Wysłano: ${new Date(msg.created_at).toLocaleString()}</small>
    `;
    messagesContainer.appendChild(messageDiv);
  });
}

// Funkcja wysyłająca wiadomość na serwer
async function sendMessage() {
  const slug = document.getElementById('slug').value;
  const messageText = document.getElementById('messageInput').value.trim();
  if (!messageText) {
    alert("Wiadomość nie może być pusta!");
    return;
  }
  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug, message: messageText })
    });
    if (!response.ok) {
      throw new Error("Błąd wysyłania wiadomości");
    }
    document.getElementById('messageInput').value = '';
    loadMessages();
  } catch (error) {
    console.error(error);
    alert("Wystąpił problem z wysłaniem wiadomości!");
  }
}

// Nasłuchiwanie kliknięcia przycisku wysyłania
document.getElementById('sendButton').addEventListener('click', sendMessage);

// Ładowanie wiadomości przy starcie strony
window.addEventListener('DOMContentLoaded', loadMessages);
