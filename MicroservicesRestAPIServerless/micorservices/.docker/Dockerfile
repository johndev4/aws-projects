FROM amazonlinux:latest AS core
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN set -ex \
    yum update -y \
    && yum install unzip -y \
    && curl -sL https://rpm.nodesource.com/setup_20.x | bash - \
    && yum install nodejs -y && npm i -g serverless@3.39.0    \
    && yum install -y aws-cli python3 \
    && npm config set registry http://registry.npmjs.org/ && npm config set loglevel info \
    && npm config set fetch-retries 3 && npm config set audit false && npm config set fetch-retry-mintimeout 15000 \
    && npm config set fetch-retry-maxtimeout 90000 && npm config set progress false \
    && yum remove unzip -y && yum clean all && rm -rf /var/cache/yum
CMD ["/bin/bash"]