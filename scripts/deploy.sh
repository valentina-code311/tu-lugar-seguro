set -e

Usage() {
  echo "Usage: ./deploy.sh [back|front]"
  exit 1
}


DeployImage() {
  # Load gcp credentials
  sh scripts/gcp_login.sh

  # Log in to Artifacts
  gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

  # Push Docker image to AWS
  docker push $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest
}

DeployFrontend() {
  # Initialize a string to store the build arguments
  BUILD_ARGS=""
  # Read the .env file line by line and construct build arguments
  while IFS='=' read -r KEY VALUE; do
    # Escape double quotes in the value to avoid syntax issues
    ESCAPED_VALUE=$(echo "$VALUE" | sed 's/"/\\"/g')
    # Append each --build-arg to the BUILD_ARGS string
    BUILD_ARGS="$BUILD_ARGS --build-arg $KEY='$ESCAPED_VALUE'"
  done < "conn/$SERVICE.env"

  # Move node_modules to temp if it exists
  if [ -d "node_modules" ]; then
    mv node_modules temp/
  fi

  # Build and tag the Docker image
  eval docker build \
    -f ./docker/$SERVICE.Dockerfile \
    $BUILD_ARGS \
    -t $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest \
    .

  DeployImage

  # Update Cloud run service
  gcloud run deploy \
    $BASE_NAME-$SERVICE \
    --project $PROJECT \
    --image $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE \
    --platform managed \
    --region $REGION \
    --port 80 \
    --timeout 3600 \
    --allow-unauthenticated \
    --service-account $BASE_NAME-$SERVICE@$PROJECT.iam.gserviceaccount.com

  # Move node_modules back to app if it exists
  if [ -d "temp/node_modules" ]; then
    mv temp/node_modules .
  fi
}

DeployBackend() {
  echo "Deploying backend not implemented yet"
  # # Build and tag the Docker image
  # docker build \
  #   -f ./docker/$SERVICE.Dockerfile \
  #   -t $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest \
  #   app/${SERVICE}end/

  # DeployImage

  # sed 's|=|: |g' conn/$SERVICE.env > conn/$SERVICE.yaml
  # echo "DEPLOYMENT_VERSION: $(date +%Y.%m.%d.%H.%M)" >> conn/$SERVICE.yaml

  # # Update Cloud run service
  # gcloud run deploy \
  #   $BASE_NAME-$SERVICE \
  #   --project $PROJECT \
  #   --image $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE \
  #   --platform managed \
  #   --region $REGION \
  #   --port 80 \
  #   --timeout 3600 \
  #   --env-vars-file conn/$SERVICE.yaml \
  #   --allow-unauthenticated \
  #   --service-account $BASE_NAME-$SERVICE@$PROJECT.iam.gserviceaccount.com

  # rm conn/$SERVICE.yaml
}

. ./conn/.env

if [ "$1" = "back" ]; then
  SERVICE=back
  DeployBackend
elif [ "$1" = "front" ]; then
  SERVICE=front
  DeployFrontend
else
  Usage
fi
