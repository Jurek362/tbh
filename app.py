from flask import Flask, request, jsonify
from database import db, Message, User
from config import Config

# Ustawiamy katalog statyczny na bieżący katalog, dzięki czemu pliki index.html, styles.css, script.js są dostępne bez podfolderów
app = Flask(__name__, static_folder=".", static_url_path="")
app.config.from_object(Config)
db.init_app(app)

# Przy pierwszym żądaniu tworzymy tabele w bazie, jeśli jeszcze nie istnieją
@app.before_first_request
def create_tables():
    db.create_all()

# Endpoint API: zapisanie wiadomości
@app.route('/api/message', methods=['POST'])
def post_message():
    data = request.get_json()
    if not data or 'slug' not in data or 'message' not in data:
        return jsonify({"error": "Brakuje wymaganych pól"}), 400

    slug = data.get('slug')
    message_text = data.get('message')

    new_message = Message(slug=slug, message=message_text)
    try:
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"success": True, "message": "Wiadomość odebrana"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Błąd serwera"}), 500

# Endpoint API: pobieranie wiadomości dla danego sluga
@app.route('/api/messages/<slug>', methods=['GET'])
def get_messages(slug):
    messages = Message.query.filter_by(slug=slug).order_by(Message.created_at.desc()).all()
    messages_list = [{
        "id": msg.id,
        "message": msg.message,
        "created_at": msg.created_at.isoformat()
    } for msg in messages]
    return jsonify({"messages": messages_list}), 200

# Strona główna – serwujemy index.html znajdujący się w katalogu głównym
@app.route('/')
def index():
    return app.send_static_file("index.html")

if __name__ == '__main__':
    app.run(debug=True)
