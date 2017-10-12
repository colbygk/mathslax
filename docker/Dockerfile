FROM ubuntu:xenial

MAINTAINER Colby Gutierrez-Kraybill <colbygk@media.mit.edu>

RUN apt-get -qq update

# Install Node.js
RUN apt-get -qq install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get -qq install --yes nodejs
RUN apt-get -qq install --yes build-essential

RUN DEBIAN_FRONTEND=noninteractive apt-get -qq install -y \
  default-jre \
  git \
  openjdk-8-jdk

ENV SERVER fqdn
ENV PORT 8099

EXPOSE 8099

RUN git clone https://github.com/colbygk/mathslax.git
WORKDIR /mathslax
RUN make install

ENTRYPOINT ["/usr/bin/node"]
CMD ["server.js"]

