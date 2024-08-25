FROM amazonlinux:latest AS core
RUN set -ex \
    yum update -y \
    && yum install unzip -y \
    && yum install -y aws-cli python3 \
    && yum install -y aws-cli pip \
    && pip3 install boto3==1.35.2 \
    && yum remove unzip -y && yum clean all && rm -rf /var/cache/yum
CMD ["/bin/bash"]