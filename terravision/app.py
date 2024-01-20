from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

def stream_process(command):
  process = subprocess.Popen(command, stdout=subprocess.PIPE, text=True)
  for line in iter(process.stdout.readline, ''):
    yield line

@app.route('/terravision/draw', methods=['GET'])
def terravision():
  source = request.args.get('source')
  try:
    return app.response_class(stream_process(['terravision', 'draw', '--source', source]), mimetype='text/plain')
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