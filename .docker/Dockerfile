FROM ubuntu:latest
LABEL maintainer="abstractFlo"

ARG BRANCH=${SERVER_BRANCH}

RUN apt-get update && apt-get install -y wget jq libatomic1

RUN buildNumber=$(wget --no-cache -qO- https://cdn.altv.mp/server/${BRANCH}/x64_linux/update.json | jq '.latestBuildNumber') && \
    nodeBuildNumber=$(wget --no-cache -qO- https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/update.json | jq '.version') && \
    wget --no-cache -O altv-server https://cdn.altv.mp/server/${BRANCH}/x64_linux/altv-server?salt=$buildNumber && \
    wget --no-cache -O vehmodels.bin https://cdn.altv.mp/server/${BRANCH}/x64_linux/data/vehmodels.bin?salt=$buildNumber && \
    wget --no-cache -O vehmods.bin https://cdn.altv.mp/server/${BRANCH}/x64_linux/data/vehmods.bin?salt=$buildNumber && \
    wget --no-cache -O libnode.so.72 https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/modules/js-module/libnode.so.72?salt=$nodeBuildNumber && \
    #wget --no-cache -O libnode.so https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/modules/js-module/libnode.so?salt=$nodeBuildNumber && \
    wget --no-cache -O libjs-module.so https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/modules/js-module/libjs-module.so?salt=$nodeBuildNumber

RUN mkdir /altv && \
    mkdir /altv/data && \
    mkdir -p /altv/modules/js-module && \
    mv altv-server /altv/ && \
    mv vehmodels.bin /altv/data && \
    mv vehmods.bin /altv/data && \
    mv libnode.so.72 /altv/modules/js-module && \
    mv libjs-module.so /altv/modules/js-module

RUN apt-get purge -y wget jq && \
    apt-get clean

ADD package.json /altv/package.json
ADD ../retail/start_server.sh /altv/start_server.sh
RUN sed -i -e 's/\r$//' /altv/start_server.sh
RUN chmod +x /altv/start_server.sh
RUN chmod +x /altv/altv-server


EXPOSE 7788
EXPOSE 7788/udp
