from flask import Flask, request, jsonify
from flask_cors import CORS

import rag

app = Flask(__name__)

CORS(app)


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        message = data.get("message", "")

        if not message.strip():
            return jsonify({
                "error": "Message required"
            }), 400

        result = rag.answer(message)

        return jsonify({
            "reply": result["answer"],
            "sources": result.get("sources", [])
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
    host="0.0.0.0",
    port=8001,
    debug=False,
    threaded=True
)