from flask import Flask, request, json, jsonify, send_from_directory
from flask_cors import CORS
import os, subprocess

app = Flask(__name__)
CORS(app)


def stream_process(command, cwd=os.getcwd(), shell=True):
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


def write_file(file_name, content):
    path = os.path.join('data', file_name)

    with open(path, "w+") as f:
        f.write(content)


@app.route("/terravision/draw", methods=["GET"])
def terravision():
    source = request.args.get("source")
    try:
        return app.response_class(
            stream_process(
                f"terravision draw --source {source} --outfile output/diagram",
            ),
            mimetype="text/plain",
        )
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500


@app.route("/terravision/graph", methods=["GET"])
def terravision_graph():
    try:
        return app.response_class(
            stream_process(
                'mkdir -p ./output && terraform graph | sed s/"RL"/"TB"/g | node ../index.js | tee /dev/stderr | dot -Tpng > ./output/diagram.dot.png',
                cwd="./data",
            )
        )
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500


@app.route("/terravision/write", methods=["POST"])
def terravision_write():
    data = json.loads(request.data)

    for file_name in ["main.tf", "variables.tf", "terraform.tfvars"]:
        write_file(file_name, data[file_name]["value"])

    return jsonify(success=True)


@app.route("/terravision/validate", methods=["GET"])
def terravision_validate():
    try:
        return app.response_class(
            stream_process("terraform init && terraform validate", cwd="./data"),
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
    return send_from_directory("./data/output", "diagram.dot.png")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)
