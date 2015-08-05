FROM debian:jessie

MAINTAINER Colby Gutierrez-Kraybill <colbygk@media.mit.edu>

RUN apt-get clean && apt-get update && apt-get upgrade -y

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
  default-jre \
  git \
  nodejs \
  npm \
  curl \
  openjdk-7-jdk

RUN ln -s /usr/bin/nodejs /usr/bin/node

ENV SERVER host.name
ENV PORT PORTTOEXPOSE

EXPOSE PORTTOEXPOSE

RUN git clone https://github.com/colbygk/mathslax.git
RUN cd mathslax && make install && nodejs server.js

CMD cd mathslax && nodejs server.js

