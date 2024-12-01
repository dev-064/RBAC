# Authentication, Authorization and RBAC System

This project demonstrates how authentication, authorization and Role-Based Access Control (RBAC) work in a web application. The system allows users to create reports and comment on them with different permission levels.

## Roles and Permissions

There are three roles in the system:

1. **USER**
   - View reports
   - Comment on reports

2. **MODERATOR** 
   - All USER permissions
   - Create reports
   - Edit reports
   - Delete reports

3. **ADMIN**
   - All MODERATOR permissions
   - Approve/reject moderator requests

## API Schema

The system have the following API endpoints:

You can get the jwt token by logging in and then using the token in the Authorization header.

## Test Api

```
curl -X GET https://rbac-o1oe.onrender.com/api/test
```

### Onboarding Apis

##### You can not register as admin directly
##### Dummy admin email and password already registered in the database are : 
##### email: admin123@gmail.com
##### password: 123456789

#### Register User

```
curl -X POST https://rbac-o1oe.onrender.com/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "username",
    "role": "USER"
  }'

```
#### Login User

```
curl -X POST https://rbac-o1oe.onrender.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

```

### Admin Apis

#### Get Moderator Requests


```
curl -X GET https://rbac-o1oe.onrender.com/api/admin/getModeratorRequests \
  -H "Authorization: Bearer jwt_token_here"

```

#### Approve Moderator Request

```
curl -X POST https://rbac-o1oe.onrender.com/api/admin/handleModeratorRequest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "userId": 1,
    "approved": true
  }'


```

### Report APIs

#### Get All Reports

```
curl -X GET https://rbac-o1oe.onrender.com/api/report \
  -H "Authorization: Bearer jwt_token_here"

```

#### Create Report

```
curl -X POST https://rbac-o1oe.onrender.com/api/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "title": "Report Title",
    "content": "Report Content"
  }'

```

#### Update Report

```
curl -X PUT https://rbac-o1oe.onrender.com/api/report/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "title": "Updated Report Title",
    "content": "Updated Report Content"
  }'

```

#### Delete Report

```
curl -X DELETE https://rbac-o1oe.onrender.com/api/report/1 \
  -H "Authorization: Bearer jwt_token_here"

```

### Comment APIs

#### Add Comment

```
curl -X POST https://rbac-o1oe.onrender.com/api/report/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "content": "Comment text here"
  }'

```

#### Delete Comment

```
curl -X DELETE https://rbac-o1oe.onrender.com/api/report/comments/1 \
  -H "Authorization: Bearer jwt_token_here"


```
