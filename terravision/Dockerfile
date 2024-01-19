FROM ubuntu:latest AS builder

RUN apt-get update && apt-get install -y graphviz git python3-pip python-is-python3 wget lsb-release

# install terraform
RUN <<EOF
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
apt-get update && apt-get install terraform
EOF

WORKDIR /app

# clone terravision repo
RUN git clone https://github.com/patrickchugh/terravision.git

# intall terravision dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r /app/terravision/requirements.txt

# mark terravision script as executable
RUN chmod +x /app/terravision/terravision

# add terravision to path
ENV PATH="/app/terravision:${PATH}"

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

COPY . /app

ENTRYPOINT ["python3"]
CMD ["app.py"]