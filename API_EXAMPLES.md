# DeafSo Backend API Examples

This file contains practical examples of how to use the DeafSo Backend API endpoints.

## 🔐 Authentication Endpoints

### Student Signup
```bash
curl -X POST http://localhost:3000/api/v1/student/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john.doe@student.com",
    "mobile": "9876543210",
    "password": "password123",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A001"
  }'
```

### Student Login
```bash
curl -X POST http://localhost:3000/api/v1/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@student.com",
    "password": "password123"
  }'
```

### Teacher Signup
```bash
curl -X POST http://localhost:3000/api/v1/teacher/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Jane Smith",
    "email": "jane.smith@teacher.com",
    "mobile": "9876543211",
    "password": "password123"
  }'
```

### Teacher Login
```bash
curl -X POST http://localhost:3000/api/v1/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@teacher.com",
    "password": "password123"
  }'
```

## 📊 Dashboard Endpoints

### Get Student Profile
```bash
# First, get the JWT token from login response
TOKEN="your_jwt_token_here"
STUDENT_ID="1"

curl -X GET http://localhost:3000/api/v1/student/profile/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Student profile retrieved successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john.doe@student.com",
    "mobile": "9876543210",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A001",
    "created_at": "2025-08-07T17:02:07.900Z",
    "updated_at": "2025-08-07T17:02:07.900Z"
  }
}
```

### Get Student Subjects
```bash
curl -X GET http://localhost:3000/api/v1/student/subjects/10/A \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Subjects retrieved successfully",
  "data": [
    {
      "id": 1,
      "subjectName": "Mathematics",
      "duration": 45,
      "views": 150,
      "content": "Advanced mathematics concepts including algebra and geometry",
      "teacher": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@deafso.com"
      },
      "created_at": "2025-08-07T17:02:07.900Z",
      "updated_at": "2025-08-07T17:02:07.900Z"
    }
  ],
  "count": 1
}
```

### Get Teacher Profile
```bash
TEACHER_ID="1"

curl -X GET http://localhost:3000/api/v1/teacher/profile/$TEACHER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Get Students in Class
```bash
curl -X GET http://localhost:3000/api/v1/class/10/A/students \
  -H "Content-Type: application/json"
```

### Get Subject Details
```bash
SUBJECT_ID="1"

curl -X GET http://localhost:3000/api/v1/subject/$SUBJECT_ID \
  -H "Content-Type: application/json"
```

## 🔍 Complete Workflow Example

### Step 1: Student Signup
```bash
curl -X POST http://localhost:3000/api/v1/student/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Alice Johnson",
    "email": "alice@example.com",
    "mobile": "9876543220",
    "password": "password123",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A002"
  }'
```

### Step 2: Extract Token from Response
```bash
# Save the token from the signup response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
STUDENT_ID="2"
```

### Step 3: Get Student Profile
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

### Step 4: Get Student Subjects
```bash
curl -X GET http://localhost:3000/api/v1/student/subjects/10/A \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

## 🧪 Testing with jq (JSON Formatter)

Install jq for better JSON formatting:
```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq

# Windows (with chocolatey)
choco install jq
```

Then use it with your API calls:
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## 🔒 Error Handling Examples

### Invalid Token
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid token."
}
```

### Missing Authentication
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Invalid Student ID
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/99999 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

## 📱 Frontend Integration Examples

### JavaScript/Fetch API
```javascript
// Student login
const loginStudent = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/v1/student/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data;
};

// Get student profile
const getStudentProfile = async (studentId, token) => {
  const response = await fetch(`http://localhost:3000/api/v1/student/profile/${studentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  return data;
};
```

### Axios Example
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Student profile API
export const getStudentProfile = (studentId) => {
  return api.get(`/student/profile/${studentId}`);
};

// Student subjects API
export const getStudentSubjects = (standard, division) => {
  return api.get(`/student/subjects/${standard}/${division}`);
};
```

## 🚀 Environment Variables

Set up your environment for easier testing:
```bash
# Set base URL
export API_BASE="http://localhost:3000/api/v1"

# Set token (after login)
export TOKEN="your_jwt_token_here"

# Use in requests
curl -X GET $API_BASE/student/profile/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Health Check

Test if the API is running:
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "DeafSo Backend API is running",
  "timestamp": "2025-08-07T17:02:07.900Z"
}
``` 