#/bin/bash
CONTAINER_NAME=$1
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ENV_FILE_PATH="$SCRIPT_DIR/../env.prod"

docker-compose --env-file $ENV_FILE_PATH down 2> /dev/null && docker-compose --env-file $ENV_FILE_PATH rm -f postgresql > /dev/null

if [ "$( docker container inspect -f '{{.State.Running}}' $CONTAINER_NAME )" == "true" ]
then
  docker stop $CONTAINER_NAME 2> /dev/null
  docker rm -f $CONTAINER_NAME 2> /dev/null
fi

docker-compose --env-file $ENV_FILE_PATH up -d

while true
do
  echo Checking...

  RESULT="$(docker ps -a | grep $CONTAINER_NAME)"

  if [[ RESULT != "" ]]
  then
    break
  fi

  sleep 0.5
done
