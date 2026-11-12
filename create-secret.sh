#!/usr/bin/env bash
# Usage: ./create-secret.sh "mongodb+srv://USER:PASSWORD@HOST/"
set -euo pipefail
kubectl delete secret student-db-secret --ignore-not-found=true
kubectl create secret generic student-db-secret --from-literal=MONGO_URI="$1"
