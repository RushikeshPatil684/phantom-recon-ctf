from flask import Flask, request, jsonify
from flask_cors import CORS
from validator import validate_nmap_command

app = Flask(__name__)
CORS(app)


@app.route('/api/ping', methods=['GET'])
def ping():
    """Test route to check if the server is running."""
    return jsonify({"message": "pong"})


@app.route('/api/validate', methods=['POST'])
def validate():
    """Validate nmap command endpoint."""
    from config import FLAG

    data = request.get_json()
    
    if not data or 'command' not in data:
        return jsonify({"success": False}), 400
    
    command = data.get('command', '')
    
    is_valid = validate_nmap_command(command)

    if is_valid:
        return jsonify({"success": True, "flag": FLAG})

    return jsonify({"success": False})


@app.route('/api/unlock', methods=['POST'])
def unlock():
    """Unlock terminal endpoint."""
    from config import TERMINAL_PASSWORD
    
    data = request.get_json()
    
    if not data or 'password' not in data:
        return jsonify({"success": False}), 400
    
    password = data.get('password', '')
    
    if password == TERMINAL_PASSWORD:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
