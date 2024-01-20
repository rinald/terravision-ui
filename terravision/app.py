from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

def stream_process(command):
  process = subprocess.Popen(command, stdout=subprocess.PIPE, text=True)
  for line in iter(process.stdout.readline, ''):
    yield line

@app.route('/terravision/draw', methods=['GET'])
def terravision():
  source = request.args.get('source')
  try:
    return app.response_class(stream_process(['terravision', 'draw', '--source', source, '--outfile', 'output/diagram']), mimetype='text/plain')
  except subprocess.CalledProcessError as e:
    return jsonify(error=str(e)), 500

@app.route('/terravision/help', methods=['GET'])
def terravision_help():
  try:
    result = subprocess.run(['terravision', '--help'], capture_output=True, text=True, check=True)
    return result.stdout
  except subprocess.CalledProcessError as e:
    return jsonify(error=str(e)), 500

@app.route('/terravision/output')
def output():
  return send_from_directory('output', 'diagram.dot.png')

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8001)