FROM ubuntu:latest AS builder

RUN apt-get update && apt-get install -y graphviz git python3-pip python-is-python3 wget curl lsb-release

# install terraform
RUN <<EOF
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
apt-get update && apt-get install terraform
EOF

# install node lts and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app

COPY . /app
RUN pip install -r requirements.txt
RUN npm install


# copy examples to shared volume mount (/data)
COPY ./examples /data/examples

ENTRYPOINT ["python"]
CMD ["app.py"]
