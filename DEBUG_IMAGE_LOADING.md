# Debug: Images Not Loading in Frontend

## 🔍 Quick Debug Steps

### 1. Check API Response
Open browser DevTools (F12) → Network tab → Visit `/blog` → Find `/api/bbweb/blogs` request → Check response

**Expected:**
```json
{
  "id": "16",
  "title": "Blog Title",
  "image": "iVBORw0KGgoAAAANSUhEUgAA...", // Long base64 string
  ...
}
```

**If image is `null` or empty:**
- Image not set in Odoo
- Upload image in Odoo and save

**If image is a short string (not base64):**
- API encoding issue
- Restart Odoo

### 2. Check Browser Console
Open DevTools → Console tab → Look for errors

**Common errors:**
- `Failed to load image` → Check if `post.image` has value
- `Invalid base64` → API encoding issue

### 3. Verify Image Conversion
In browser console on `/blog` page:
```javascript
fetch('/api/bbweb/blogs')
  .then(r => r.json())
  .then(data => {
    const firstPost = data[0];
    console.log('Has image?', !!firstPost?.image);
    console.log('Image length:', firstPost?.image?.length);
    console.log('Image preview:', firstPost?.image?.substring(0, 50));
    console.log('Is base64?', firstPost?.image?.startsWith('iVBORw0KGgo') || firstPost?.image?.startsWith('/9j/'));
  });
```

### 4. Check if Odoo Was Restarted
- **Critical**: Odoo must be restarted after API changes
- Check Odoo logs for any errors
- Verify the fix is in the code

---

## ✅ Fixes Applied

1. **Odoo List View**: Image thumbnail size reduced to 50x50px
2. **API Encoding**: Fixed to use `base64.b64encode()`

---

## 🚀 Next Steps

1. **Restart Odoo** (if not done)
2. **Upload images** for posts that need them
3. **Clear browser cache** (Ctrl+Shift+R)
4. **Check API response** in Network tab
5. **Check browser console** for errors
