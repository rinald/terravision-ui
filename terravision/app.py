from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/terravision/draw', methods=['GET'])
def terravision():
  source = request.args.get('source')
  try:
    result = subprocess.run(['terravision', 'draw', '--source', source], capture_output=True, text=True, check=True)
    return result.stdout
  except subprocess.CalledProcessError as e:
    return jsonify(error=str(e)), 500

@app.route('/terravision/help', methods=['GET'])
def terravision_help():
  try:
    result = subprocess.run(['terravision', '--help'], capture_output=True, text=True, check=True)
    return result.stdout
  except subprocess.CalledProcessError as e:
    return jsonify(error=str(e)), 500

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8001)