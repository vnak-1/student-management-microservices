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
minikube addons enable ingress
for n in api-gateway registration-service delete-service; do minikube image build -t $n:v1 ./$n; done
./create-secret.sh "mongodb+srv://USER:PASSWORD@HOST/"
kubectl apply -f k8s/
kubectl get pods,svc,ingress -o wide
```

## Reach the gateway through the Ingress
`k8s/ingress.yaml` sends `http://studentms.com/*` to `gateway-service:3000`.

1. Add the domain to `/etc/hosts` (Mac + Docker driver: use `127.0.0.1`, not `minikube ip`):
```bash
sudo sh -c 'printf "\n127.0.0.1 studentms.com\n" >> /etc/hosts'
```
2. Start the tunnel in its own terminal and keep it open (asks for your Mac password):
```bash
minikube tunnel
```
3. Import `postman/student-management.postman_collection.json` into the Postman desktop app. Base URL: `http://studentms.com`.

| Request | URL |
|---|---|
| Register | `POST http://studentms.com/api/register` |
| List | `GET http://studentms.com/api/students` |
| Delete | `DELETE http://studentms.com/api/students/S001` |
