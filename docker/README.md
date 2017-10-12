# Docker Example Setup

This Dockerfile is provided as an example of how Mathslax can be run
from within a [Docker](https://www.docker.com) container.

You may wish to create a [separate volume](http://crosbymichael.com/advanced-docker-volumes.html) used for long term storage of
PNG products. 

## Setup and run Example
```
$ docker build -t mathslax .
$ docker run -d -p port:port --name=mathslax --hostname=mathslax -e SLACK_AUTH_TOKEN="token" mathslax
```

