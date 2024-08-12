FROM amazonlinux:latest AS core
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN set -ex \
    yum update -y \
    && yum install unzip -y \
    && yum install -y aws-cli python3 \
    && yum remove unzip -y && yum clean all && rm -rf /var/cache/yum
CMD ["/bin/bash"]