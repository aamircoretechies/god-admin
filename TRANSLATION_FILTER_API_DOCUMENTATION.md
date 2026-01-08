# Translation Filter (KJV/SV) - API Integration Documentation

## Overview
The Bible Books and Chapters page now supports filtering by translation (KJV or SV). This document outlines what the frontend sends and what the backend needs to return.

---

## API Endpoints Requiring Translation Support

### 1. Get Bible Books List
**Endpoint:** `GET /api/v1/admin/bible/books`

**Query Parameters:**
- `page` (optional): number - Page number (default: 1)
- `limit` (optional): number - Items per page (default: 20)
- `translation` (optional): string - Translation code: **"KJV"** or **"SV"**

**Example Requests:**
```
GET /api/v1/admin/bible/books?page=1&limit=20&translation=KJV
GET /api/v1/admin/bible/books?page=1&limit=20&translation=SV
GET /api/v1/admin/bible/books?page=1&limit=20  (no translation filter)
```

**Expected Response:**
```json
{
  "status": 1,
  "data": [
    {
      "book_id": "string",
      "book_order": number,
      "short_name": "string",
      "long_name": "string",
      "testament": "OLD" | "NEW",
      "total_chapters": number,
      "created_at": "string",
      "_count": {
        "chapters": number
      }
    }
  ]
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here",
  "data": null
}
```

**Backend Requirements:**
- Accept `translation` query parameter
- Filter books by the specified translation
- If `translation` is not provided, return all books (or default to KJV based on your preference)
- Return the same response structure

---

### 2. Get Bible Book Detail (with Chapters)
**Endpoint:** `GET /api/v1/admin/bible/books/{bookId}`

**Query Parameters:**
- `translation` (optional): string - Translation code: **"KJV"** or **"SV"**

**Example Requests:**
```
GET /api/v1/admin/bible/books/{bookId}?translation=KJV
GET /api/v1/admin/bible/books/{bookId}?translation=SV
GET /api/v1/admin/bible/books/{bookId}  (no translation filter)
```

**Expected Response:**
```json
{
  "status": 1,
  "data": {
    "book_id": "string",
    "book_order": number,
    "short_name": "string",
    "long_name": "string",
    "testament": "OLD" | "NEW",
    "total_chapters": number,
    "created_at": "string",
    "chapters": [
      {
        "chapter_id": "string",
        "chapter_number": number,
        "created_at": "string"
      }
    ]
  }
}
```

**Backend Requirements:**
- Accept `translation` query parameter
- Return chapters for the specified translation
- If `translation` is not provided, return chapters for default translation (or all)

---

## Frontend Implementation Details

### State Management
- Default translation: **"KJV"**
- Translation filter is stored in component state: `translationFilter`
- When translation changes:
  - Page resets to 1
  - Chapters cache is cleared
  - All expanded books are collapsed
  - Books list reloads with new translation

### User Flow
1. User selects translation (KJV or SV) from dropdown
2. Frontend sends API request with `translation` parameter
3. Backend returns filtered books for that translation
4. When user expands a book, chapters are loaded with the same translation filter
5. If user changes translation, all data is cleared and reloaded

---

## Translation Codes

Currently supported:
- **KJV** - King James Version
- **SV** - (Please confirm what SV stands for - possibly Swedish Version or another translation)

**Questions for Backend Team:**
1. What does "SV" stand for?
2. Are there other translation codes that should be supported?
3. Should the `translation` parameter be required or optional?
4. If `translation` is not provided, should it default to KJV or return all translations?

---

## Testing Checklist

- [ ] Books list loads correctly with KJV filter
- [ ] Books list loads correctly with SV filter
- [ ] Books list loads correctly without translation filter
- [ ] Chapters load correctly when book is expanded (with translation filter)
- [ ] Changing translation clears and reloads data correctly
- [ ] Pagination works correctly with translation filter
- [ ] Search and testament filters work together with translation filter

---

## Files Modified

### Frontend Files:
1. `god-admin/src/services/bibleBooksApi.ts`
   - Added `translation` parameter to `fetchBibleBooks()`
   - Added `translation` parameter to `fetchBibleBookDetail()`

2. `god-admin/src/pages/bible-content/books-chapters/BibleBooksChaptersContent.tsx`
   - Added `translationFilter` state
   - Added translation filter dropdown UI
   - Updated `useEffect` to include translation in API calls
   - Added logic to clear chapters cache when translation changes

---

## Notes

- The frontend is fully implemented and ready
- Backend needs to support the `translation` query parameter on both endpoints
- The response structure should remain the same - only the filtered data changes
- Translation filter works in combination with other filters (search, testament)

