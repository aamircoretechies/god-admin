# New & Modified API Endpoints Documentation

This document contains all new APIs and modifications made to existing APIs for frontend integration.

---

## Table of Contents
1. [Modified Endpoints](#modified-endpoints)
2. [New Endpoints](#new-endpoints)
3. [Response Format](#response-format)

---

## Response Format

All endpoints follow this standard response format:

**Success Response:**
```json
{
  "status": 1,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message",
  "data": null
}
```

---

## Modified Endpoints

### 1. Admin Login (Modified Error Messages)

**Endpoint:** `POST /api/v1/admin/auth/login`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": 1,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "user_id": "uuid",
      "email": "admin@example.com",
      "role": "ADMIN",
      "first_name": "John",
      "last_name": "Doe",
      "custom_roles": [
        {
          "role_id": "uuid",
          "role_name": "Moderator",
          "permissions": { ... }
        }
      ]
    }
  }
}
```

**Error Responses (200):**

1. **Email not registered:**
```json
{
  "status": 0,
  "message": "Email not registered. Please check your email address or contact support.",
  "data": null
}
```

2. **Invalid password:**
```json
{
  "status": 0,
  "message": "Invalid password. Please check your password and try again.",
  "data": null
}
```

3. **Password not set:**
```json
{
  "status": 0,
  "message": "Password not set. Please use password reset or contact support.",
  "data": null
}
```

4. **Access denied:**
```json
{
  "status": 0,
  "message": "Access denied. Admin role or custom role required.",
  "data": null
}
```

---

### 2. Get All Users (Added Status Filter & Enhanced Search)

**Endpoint:** `GET /api/v1/admin/users` or `GET /api/v1/users`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page |
| search | string | No | - | Search in name or email |
| status | string | No | - | Filter by status: "active" or "inactive" |
| sortBy | string | No | "created_at" | Sort field: "joinedAt", "created_at", "lastLogin", "last_login", "email", "name", "latest", "oldest" |
| sortOrder | string | No | "desc" | Sort order: "asc" or "desc" |

**Example Request:**
```
GET /api/v1/admin/users?page=1&limit=10&search=john&status=active&sortBy=latest&sortOrder=desc
```

**Success Response (200):**
```json
{
  "status": 1,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-01-15T10:30:00Z",
        "last_login": "2024-01-20T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Response (200):**
```json
{
  "status": 0,
  "message": "Failed to retrieve users",
  "data": null
}
```

---

### 3. Get User Profile (Added Technical/Device Info)

**Endpoint:** `GET /api/v1/admin/users/:id/profile`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | User ID |

**Success Response (200):**
```json
{
  "status": 1,
  "message": "User profile retrieved successfully",
  "data": {
    "basicUserInfo": {
      "userId": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "memberSince": "January 15, 2024",
      "accountType": "PREMIUM",
      "status": "active"
    },
    "onboardingPreferences": {
      "experienceAndPurpose": {
        "bibleExperienceLevel": "Regular",
        "reasonForUsingApp": "I want to deepen my understanding"
      },
      "engagementAndStyle": {
        "engagementMode": "Reading",
        "explanationStyle": "Balanced"
      },
      "preferences": {
        "bibleTranslation": "KJV",
        "language": "en"
      },
      "dailyHabits": {
        "dailyVerse": "Yes-daily",
        "reflectionLength": "Medium"
      },
      "customNote": "I want to deepen my understanding"
    },
    "userActivity": {
      "basicActivityStats": {
        "lastLoginDate": "January 20, 2024 at 2:20 PM",
        "totalSessions": 45,
        "pagesVersesAccessed": 120
      },
      "contentEngagement": {
        "bookmarksFavoritesCount": 25,
        "dailyVerseSubscriptionStatus": "Active",
        "offlineAccessUsage": "Yes"
      }
    },
    "roleAndAccess": {
      "currentRole": "User",
      "basicPermissionsList": [
        "Reading Bible content",
        "Sharing content",
        "Creating notes and bookmarks",
        "Accessing AI explanations"
      ],
      "restrictions": [
        "Admin-only areas blocked",
        "Cannot modify system settings",
        "Cannot access user management"
      ]
    },
    "technicalInfo": {
      "deviceModel": "Mobile iOS",
      "osVersion": "iOS 17.2",
      "appVersion": "1.2.3",
      "ipAddress": "192.168.1.1",
      "location": "New York, USA",
      "lastSyncTimestamp": "January 20, 2024 at 2:20 PM",
      "devicesUsed": [
        "Mobile iOS",
        "Web Desktop"
      ]
    }
  }
}
```

**Error Response (200):**
```json
{
  "status": 0,
  "message": "User not found",
  "data": null
}
```

---

## New Endpoints

### 4. Export User Data

**Endpoint:** `GET /api/v1/admin/users/:id/export`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| format | string | No | "json" | Export format: "json" or "csv" |

**Example Request:**
```
GET /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000/export?format=json
```

**Success Response (200):**
```json
{
  "status": 1,
  "message": "User data exported successfully",
  "data": {
    "exportDate": "2024-01-20T14:30:00.000Z",
    "user": {
      "userId": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PREMIUM",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:20:00Z"
    },
    "preferences": {
      "bible_version": "KJV",
      "language_code": "en",
      "receive_daily": true,
      ...
    },
    "subscriptions": {
      "subscription_id": "uuid",
      "plan": "PREMIUM",
      "status": "ACTIVE",
      ...
    },
    "bookmarks": [
      {
        "bookmark_id": "uuid",
        "verse_reference": "John 3:16",
        ...
      }
    ],
    "notes": [
      {
        "note_id": "uuid",
        "content": "Note content",
        ...
      }
    ],
    "activityLogs": [
      {
        "log_id": "uuid",
        "action": "read_verse",
        "activity_type": "Verse Read",
        ...
      }
    ],
    "dailyVerses": [
      {
        "daily_verse_id": "uuid",
        "verse_reference": "John 3:16",
        ...
      }
    ]
  }
}
```

**Error Response (200):**
```json
{
  "status": 0,
  "message": "User not found",
  "data": null
}
```

---

### 5. Update User Profile (Edit Profile)

**Endpoint:** `PUT /api/v1/admin/users/:id/profile`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | User ID |

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "role": "PREMIUM"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Success Response (200):**
```json
{
  "status": 1,
  "message": "User profile updated successfully",
  "data": {
    "user_id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "PREMIUM",
    "created_at": "2024-01-15T10:30:00Z",
    "last_login": "2024-01-20T14:20:00Z"
  }
}
```

**Error Responses (200):**

1. **Invalid user ID:**
```json
{
  "status": 0,
  "message": "Invalid user ID format. Expected UUID.",
  "data": null
}
```

2. **User not found:**
```json
{
  "status": 0,
  "message": "User not found",
  "data": null
}
```

3. **Email already in use:**
```json
{
  "status": 0,
  "message": "Email already in use by another user",
  "data": null
}
```

---

### 6. Share Team Member

**Endpoint:** `POST /api/v1/users/team/:id/share`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Team member user ID |

**Request Body:**
```json
{
  "email": "recipient@example.com",
  "permissions": ["read", "write"]
}
```

**Note:** Request body is optional. The endpoint generates a share link regardless.

**Success Response (200):**
```json
{
  "status": 1,
  "message": "Share link generated successfully",
  "data": {
    "shareToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "shareUrl": "http://localhost:3000/admin/team/invite/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "expiresAt": "2024-01-27T14:30:00.000Z"
  }
}
```

**Error Response (200):**
```json
{
  "status": 0,
  "message": "Team member not found",
  "data": null
}
```

---

### 7. Report Team Member

**Endpoint:** `POST /api/v1/users/team/:id/report`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Team member user ID |

**Request Body:**
```json
{
  "reason": "Inappropriate behavior",
  "description": "Detailed description of the issue"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reason | string | No | Reason for reporting (default: "Other") |
| description | string | No | Detailed description |

**Success Response (200):**
```json
{
  "status": 1,
  "message": "Report submitted successfully",
  "data": {
    "reportId": "uuid",
    "teamMemberId": "uuid",
    "teamMemberEmail": "member@example.com",
    "reason": "Inappropriate behavior",
    "description": "Detailed description of the issue",
    "reportedBy": "admin@example.com",
    "reportedAt": "2024-01-20T14:30:00.000Z"
  }
}
```

**Error Response (200):**
```json
{
  "status": 0,
  "message": "Team member not found",
  "data": null
}
```

---

### 8. Import Team Members

**Endpoint:** `POST /api/v1/users/team/import`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "members": [
    {
      "email": "member1@example.com",
      "password": "password123",
      "first_name": "John",
      "last_name": "Doe",
      "role": "FREE",
      "custom_role_id": "uuid"
    },
    {
      "email": "member2@example.com",
      "password": "password456",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "PREMIUM"
    }
  ]
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| members | array | Yes | Array of member objects |
| members[].email | string | Yes | Member email address |
| members[].password | string | No | Member password (optional, can be set later) |
| members[].first_name | string | No | First name |
| members[].last_name | string | No | Last name |
| members[].role | string | No | User role: "FREE", "PREMIUM", "ADMIN" (default: "FREE") |
| members[].custom_role_id | string (UUID) | No | Custom role ID to assign |

**Success Response (200):**
```json
{
  "status": 1,
  "message": "Import completed: 2 success, 0 failed, 1 skipped",
  "data": {
    "success": [
      {
        "user_id": "uuid",
        "email": "member1@example.com",
        "role": "FREE"
      },
      {
        "user_id": "uuid",
        "email": "member2@example.com",
        "role": "PREMIUM"
      }
    ],
    "failed": [],
    "skipped": [
      {
        "email": "existing@example.com",
        "reason": "Already exists"
      }
    ]
  }
}
```

**Error Responses (200):**

1. **Empty members array:**
```json
{
  "status": 0,
  "message": "Members array is required and must not be empty",
  "data": null
}
```

2. **Import failed:**
```json
{
  "status": 0,
  "message": "Failed to import team members",
  "data": null
}
```

---

## Summary of Changes

### Modified Endpoints:
1. ✅ **Admin Login** - Enhanced error messages for better UX
2. ✅ **Get All Users** - Added status filter and improved search/sort
3. ✅ **Get User Profile** - Added technical/device information

### New Endpoints:
1. ✅ **Export User Data** - Export user data in JSON/CSV format
2. ✅ **Update User Profile** - Edit user profile information
3. ✅ **Share Team Member** - Generate share link for team member access
4. ✅ **Report Team Member** - Report team member issues
5. ✅ **Import Team Members** - Bulk import team members from array

---

## Authentication

All endpoints (except login) require authentication via Bearer token:

```
Authorization: Bearer {your_jwt_token}
```

---

## Error Handling

All endpoints return HTTP status `200` with `status: 0` or `status: 1` in the response body. The frontend should check the `status` field rather than HTTP status code.

---

## Notes for Frontend Integration

1. **Status Field**: Always check `response.status` (1 = success, 0 = error) instead of HTTP status code
2. **Error Messages**: Display `response.message` to users for all error cases
3. **Pagination**: Use `pagination.hasNext` and `pagination.hasPrev` for navigation
4. **UUID Validation**: All user IDs must be valid UUIDs
5. **Date Formats**: Dates are returned in ISO 8601 format or formatted strings
6. **Optional Fields**: Many fields can be `null` - handle null cases in UI
7. **Search**: Search is case-insensitive and searches across name and email
8. **Status Filter**: "active" = logged in within last 30 days, "inactive" = otherwise

---

## Testing Examples

### Test Admin Login with Unregistered Email:
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"test123"}'
```

### Test Get Users with Filters:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users?page=1&limit=10&search=john&status=active&sortBy=latest" \
  -H "Authorization: Bearer {token}"
```

### Test Export User Data:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/{user_id}/export?format=json" \
  -H "Authorization: Bearer {token}"
```

### Test Import Team Members:
```bash
curl -X POST http://localhost:3000/api/v1/users/team/import \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "members": [
      {
        "email": "newmember@example.com",
        "password": "password123",
        "first_name": "New",
        "last_name": "Member",
        "role": "FREE"
      }
    ]
  }'
```

---

**Last Updated:** January 20, 2024

