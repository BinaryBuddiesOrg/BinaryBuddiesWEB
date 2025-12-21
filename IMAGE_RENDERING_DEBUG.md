# Image Rendering Debug Guide

## 🔍 Issue: Image in API Response But Not Rendering

The image is in the API response but not showing in the UI. Let's debug step by step.

---

## ✅ Code Improvements Made

1. **Better MIME type detection** - Auto-detects JPEG/PNG/WebP
2. **Enhanced validation** - Checks for `data:image` prefix
3. **Debug logging** - Console logs to track image data flow
4. **Better error handling** - More detailed error messages

---

## 🚀 Debug Steps

### Step 1: Check Browser Console

Open DevTools (F12) → Console tab → Visit `/blog` page

**Look for:**
- `[BlogCard] Post "..."` logs - Shows image data for each post
- `[fetchBlogs]` warnings - Shows if conversion failed
- `[base64ToDataUrl]` warnings - Shows if base64 is invalid
- `[BlogCard] Image loaded successfully` - Confirms image loaded
- `[BlogCard] Image failed to load` - Shows why image failed

### Step 2: Check Network Response

1. Open DevTools (F12) → Network tab
2. Visit `/blog` page
3. Find `/api/bbweb/blogs` request
4. Click on it → Response tab
5. Check the `image` field

**Expected format:**
```json
{
  "id": "16",
  "image": "iVBORw0KGgoAAAANSUhEUgAA...", // Long base64 string (no data: prefix)
  ...
}
```

### Step 3: Check Converted Data

In browser console, run:
```javascript
// Check what the hook receives
fetch('/api/bbweb/blogs')
  .then(r => r.json())
  .then(data => {
    const firstPost = data[0];
    console.log('Raw API response:', {
      hasImage: !!firstPost.image,
      imageType: typeof firstPost.image,
      imageLength: firstPost.image?.length,
      imagePreview: firstPost.image?.substring(0, 50),
    });
    
    // Simulate the conversion
    const image = firstPost.image;
    if (image && image.startsWith('iVBORw0KGgo')) {
      const dataUrl = `data:image/png;base64,${image}`;
      console.log('Converted data URL:', {
        length: dataUrl.length,
        preview: dataUrl.substring(0, 100),
        isValid: dataUrl.startsWith('data:image'),
      });
      
      // Test if it works
      const img = new Image();
      img.onload = () => console.log('✅ Image is valid!');
      img.onerror = (e) => console.error('❌ Image is invalid!', e);
      img.src = dataUrl;
    }
  });
```

### Step 4: Check React Component State

In browser console, run:
```javascript
// Check what React component receives
// This requires React DevTools or adding console.log in component
```

Or add temporary logging in BlogCard:
```typescript
console.log('BlogCard received:', {
  title: post.title,
  hasImage: !!post.image,
  imageType: typeof post.image,
  imageStartsWith: post.image?.substring(0, 30),
});
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Image is `null` or `undefined`
**Symptom**: `[BlogCard] Post "...": No image`
**Cause**: Image not set in Odoo or API not returning it
**Fix**: Upload image in Odoo and save

### Issue 2: Image is base64 but not converted
**Symptom**: `[BlogCard] Post "...": has image but not in data URL format`
**Cause**: `base64ToDataUrl()` not working
**Fix**: Check console for conversion errors

### Issue 3: Image fails to load
**Symptom**: `[BlogCard] Image failed to load`
**Cause**: Invalid data URL format or corrupted base64
**Fix**: Check error details in console

### Issue 4: Image too large
**Symptom**: Image loads but very slowly or times out
**Cause**: Base64 string too large (100KB+)
**Fix**: Optimize images in Odoo (compress before upload)

---

## 📋 Debug Checklist

- [ ] **Browser console checked** - Look for debug logs
- [ ] **Network response checked** - Verify image is in API
- [ ] **Data URL format verified** - Should start with `data:image`
- [ ] **Image validation tested** - Test data URL in console
- [ ] **React component checked** - Verify component receives data
- [ ] **Error messages reviewed** - Check for specific errors

---

## 🎯 Quick Test

Paste this in browser console on `/blog` page:

```javascript
// Complete debug script
(async () => {
  console.log('=== IMAGE DEBUG START ===');
  
  // 1. Check API response
  const response = await fetch('/api/bbweb/blogs');
  const data = await response.json();
  console.log('1. API Response:', {
    totalPosts: data.length,
    firstPostImage: {
      exists: !!data[0]?.image,
      type: typeof data[0]?.image,
      length: data[0]?.image?.length,
      preview: data[0]?.image?.substring(0, 50),
    }
  });
  
  // 2. Test conversion
  if (data[0]?.image) {
    const base64 = data[0].image;
    const dataUrl = `data:image/png;base64,${base64}`;
    console.log('2. Converted Data URL:', {
      length: dataUrl.length,
      preview: dataUrl.substring(0, 100),
      isValid: dataUrl.startsWith('data:image'),
    });
    
    // 3. Test image loading
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = () => {
        console.log('3. ✅ Image is VALID and can be loaded!');
        console.log('   Dimensions:', img.width, 'x', img.height);
        resolve(true);
      };
      img.onerror = (e) => {
        console.error('3. ❌ Image FAILED to load!', e);
        resolve(false);
      };
      img.src = dataUrl;
    });
  }
  
  console.log('=== IMAGE DEBUG END ===');
})();
```

---

## 💡 Expected Output

**If everything works:**
```
1. API Response: { totalPosts: 7, firstPostImage: { exists: true, length: 52384, ... } }
2. Converted Data URL: { isValid: true, ... }
3. ✅ Image is VALID and can be loaded!
   Dimensions: 800 x 400
```

**If there's an issue:**
- Check the error message
- Verify the base64 string format
- Check if image is actually set in Odoo

---

## 🆘 Next Steps

After running the debug script:
1. **Share the console output** - This will show exactly what's wrong
2. **Check Odoo** - Verify image is actually uploaded
3. **Check API** - Verify `/api/bbweb/blogs` returns base64 strings
4. **Check conversion** - Verify `base64ToDataUrl()` is working

The debug logs will tell us exactly where the issue is!

