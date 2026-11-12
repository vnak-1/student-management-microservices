# Student Management System – Microservices on Kubernetes

Final Lab Exam. 2nd microservice: **Delete Student**.

## Services
| Service | Port | Pod | Endpoint |
|---|---|---|---|
| api-gateway | 3000 | Pod 1 | entry point for all requests |
| registration-service | 3001 | Pod 1 | `POST /register`, `GET /students` |
| delete-service | 3002 | Pod 2 | `DELETE /students/:id` |

Database: MongoDB Atlas, database `studentdb`, collection `students`.
Fields: `Student_id, Student_name, student_mobile, student_email, student_password` (password is bcrypt-hashed).

## Gateway routes (all requests go through the gateway)
- `POST   /api/register` → registration-service
- `GET    /api/students` → registration-service
- `DELETE /api/students/:id` → delete-service

## Run on Minikube
```bash
minikube start
for n in api-gateway registration-service delete-service; do minikube image build -t $n:v1 ./$n; done
./create-secret.sh "mongodb+srv://USER:PASSWORD@HOST/"
kubectl apply -f k8s/
kubectl get pods,svc
kubectl port-forward service/gateway-service 3000:3000
```
Import `postman/student-management.postman_collection.json` into Postman and use base URL `http://localhost:3000`.
