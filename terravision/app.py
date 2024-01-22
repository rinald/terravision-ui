from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, subprocess

app = Flask(__name__)
CORS(app)


def stream_process(command, cwd=os.getcwd(), shell=False):
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd=cwd,
        shell=shell,
    )

    for line in iter(process.stdout.readline, ""):
        yield line

    for line in iter(process.stderr.readline, ""):
        yield line


def write_file(content):
    path = os.path.join(os.sep, "data", "main.tf")

    with open(path, "w+") as f:
        f.write(content)


@app.route("/terravision/draw", methods=["GET"])
def terravision():
    source = request.args.get("source")
    try:
        return app.response_class(
            stream_process(
                [
                    "terravision",
                    "draw",
                    "--source",
                    source,
                    "--outfile",
                    "output/diagram",
                ]
            ),
            mimetype="text/plain",
        )
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500

@app.route('/terravision/graph', methods=['GET'])
def terravision_graph():
    try:
        return app.response_class(
            stream_process(
                'mkdir -p /app/output && terraform graph | tee /dev/stderr | dot -Tpng > /app/output/diagram.dot.png',
                cwd='/data',
                shell=True
            )
        )
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500


@app.route("/terravision/write", methods=["POST"])
def terravision_write():
    write_file(request.data.decode("utf-8"))
    return jsonify(success=True)


@app.route("/terravision/validate", methods=["GET"])
def terravision_validate():
    try:
        return app.response_class(
            stream_process(
                "terraform init && terraform validate", cwd="/data", shell=True
            ),
            mimetype="text/plain",
        )
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500


@app.route("/terravision/help", methods=["GET"])
def terravision_help():
    try:
        result = subprocess.run(
            ["terravision", "--help"], capture_output=True, text=True, check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500


@app.route("/terravision/output")
def terravision_output():
    return send_from_directory("output", "diagram.dot.png")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)
