FROM cypress/browsers:node11.13.0-chrome73

USER root

ARG TEST_FUSION_IP
ARG TEST_NS_SINGLE
ARG TEST_NS_NAME

RUN npm install --no-save cypress@3.2.0 mocha@5.2.0 mochawesome@4.0.1 mochawesome-merge@2.0.1 mochawesome-report-generator@4.0.0 && \
   ./node_modules/.bin/cypress verify;

ENV TEST_FUSION_IP=$TEST_FUSION_IP \
   TEST_NS_SINGLE=$TEST_NS_SINGLE \
   TEST_NS_NAME=$TEST_NS_NAME

COPY . .

RUN echo "TEST TEST_NS_NAME=${TEST_NS_NAME} TEST_NS_SINGLE=${TEST_NS_SINGLE}" && \
   echo "$TEST_FUSION_IP     fusion" >> /etc/hosts && \
   TEST_NS_IP=$(echo ${TEST_NS_SINGLE} | awk -F '/' '{ print $3 }'|awk -F ':' '{ print $1  }') && \
   NS_SINGLE_IP=$TEST_NS_IP NS_SINGLE_NAME=$TEST_NS_NAME ./node_modules/.bin/cypress run --browser chrome || \
   true;

ENTRYPOINT ["/bin/bash"]