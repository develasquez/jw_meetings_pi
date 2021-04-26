#!/bin/bash



echo "Desplegando Microservicio"

gcloud builds submit --tag gcr.io/buscarsalud-cloud/jw_meetings:0.0.$1
#gcloud run deploy jw-meetings --image gcr.io/buscarsalud-cloud/jw_meetings:0.0.$1 --platform managed --region us-central1