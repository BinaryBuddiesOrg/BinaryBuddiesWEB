# Blog Image Loading - Troubleshooting Guide

## 🔍 Issue: Images Not Loading in Frontend

### Possible Causes:

1. **Image not set in Odoo** - Check if image is actually uploaded
2. **Odoo not restarted** - Changes need Odoo restart
3. **Browser cache** - Old cached data
4. **Image encoding issue** - API encoding problem

---

## ✅ Fixes Applied

### 1. API Encoding Fixed
- ✅ Fixed `get_blog()` endpoint - now uses `base64.b64encode()`
- ✅ Fixed `get_blog_by_slug()` endpoint - now uses `base64.b64encode()`
- ✅ List endpoint already correct (uses `get_api_data()`)

### 2. Odoo View Improved
- ✅ Added image thumbnail in list view
- ✅ Improved preview image section with better layout
- ✅ Added helpful instructions and recommendations

---

## 🚀 Steps to Fix

### Step 1: Restart Odoo
```bash
# Restart Odoo service
# Or if using Docker:
docker compose restart odoo
```

### Step 2: Verify Image in Odoo
1. Go to: **Binary Buddies Web → Blog Posts**
2. Open a blog post
3. Check if **Preview Image** section has an image
4. If not, upload an image (800x400px recommended)
5. **Save** the blog post

### Step 3: Clear Browser Cache
- **Chrome/Edge**: Ctrl+Shift+Delete → Clear cache
- **Or**: Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Step 4: Check API Response
1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit `/blog` page
4. Find request to `/api/bbweb/blogs`
5. Check response - `image` field should be a long base64 string (starts with characters like `iVBORw0KGgo...`)

### Step 5: Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors related to images
4. Check if `post.image` has a value

---

## 🔧 Debugging

### Check if Image is in API Response:
```javascript
// In browser console on /blog page
fetch('/api/bbweb/blogs')
  .then(r => r.json())
  .then(data => {
    console.log('First post image:', data[0]?.image?.substring(0, 50));
    console.log('Has image?', !!data[0]?.image);
  });
```

### Expected Response:
```json
{
  "id": "16",
  "title": "Blog Title",
  "image": "iVBORw0KGgoAAAANSUhEUgAA...", // Long base64 string
  ...
}
```

### If image is `null`:
- Image is not set in Odoo
- Upload image in Odoo and save

### If image is empty string `""`:
- Image field exists but is empty
- Upload image in Odoo and save

### If image is a short string (not base64):
- Encoding issue - check Odoo logs
- Restart Odoo

---

## 📋 Checklist

- [ ] Odoo restarted after code changes
- [ ] Image uploaded in Odoo for the blog post
- [ ] Blog post saved in Odoo
- [ ] Browser cache cleared
- [ ] Hard refresh done (Ctrl+Shift+R)
- [ ] API response checked (has base64 image string)
- [ ] No console errors in browser

---

## 🎯 Quick Test

1. **In Odoo:**
   - Create/edit a blog post
   - Upload a test image (any image, 800x400px)
   - Save

2. **In Browser:**
   - Go to `/blog` page
   - Hard refresh (Ctrl+Shift+R)
   - Check if image appears

3. **If still not working:**
   - Check browser console for errors
   - Check Network tab for API response
   - Verify image field in API response is not null

---

## 💡 Common Issues

### Issue: "Image shows placeholder"
**Solution:** Image is not set in Odoo. Upload image and save.

### Issue: "Image broken/not loading"
**Solution:** 
- Check API response - image should be base64 string
- Clear browser cache
- Check browser console for errors

### Issue: "Some images load, others don't"
**Solution:**
- Check which posts have images set in Odoo
- Only posts with images will show images
- Posts without images show placeholder (this is correct)

---

## ✅ Status

After following these steps, images should load correctly. If issues persist, check:
1. Odoo logs for errors
2. Browser console for JavaScript errors
3. Network tab for API errors
