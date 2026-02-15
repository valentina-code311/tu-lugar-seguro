set -e

SetupFrontend() {
  gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    storage.googleapis.com

  # Create Artifact Registry repository
  gcloud artifacts repositories create $BASE_NAME \
    --repository-format=docker \
    --location=$REGION

  # Create Cloud Run service account
  gcloud iam service-accounts create $BASE_NAME-front \
    --display-name $BASE_NAME-front \
    --description "SA for service $BASE_NAME-front"

  # Create CI/CD service account
  gcloud iam service-accounts create $BASE_NAME-ci \
    --display-name $BASE_NAME-ci \
    --description "SA for service $BASE_NAME-ci"

  # Config CI/CD Service Account Permissions
  SA_EMAIL=$BASE_NAME-ci@$PROJECT.iam.gserviceaccount.com
  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/artifactregistry.writer

  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/run.developer

  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/iam.serviceAccountUser

  # download ci json from service account
  gcloud iam service-accounts keys create \
    conn/gcp_ci.json \
    --iam-account=$BASE_NAME-ci@$PROJECT.iam.gserviceaccount.com

  # Configurar secrets and variables for repository
  REPOSITORY=$(gh repo view --json nameWithOwner -q '.nameWithOwner')
  BODY=$(cat conn/gcp_ci.json)
  gh secret set GCP_CREDENTIALS_JSON -R "$REPOSITORY" -b "$BODY"

  BODY=$(cat conn/front.env | sed "s|VITE_API_URL=.*|VITE_API_URL=http://localhost:8080|")
  gh variable set FRONTEND_ENV_FILE -R "$REPOSITORY" -b "$BODY"

  ACCOUNT=$BASE_NAME-ci@$PROJECT.iam.gserviceaccount.com
  BODY=$(cat conn/.env | sed "s|ACCOUNT=.*|ACCOUNT=$ACCOUNT|")
  gh variable set ENV_FILE -R "$REPOSITORY" -b "$BODY"
}

touch ./conn/.env && . ./conn/.env

if [ -z "$BASE_NAME" ]; then
  echo BASE_NAME=maryen >> conn/.env
fi
. ./scripts/gcp_login.sh
. ./conn/.env

SetupFrontend
