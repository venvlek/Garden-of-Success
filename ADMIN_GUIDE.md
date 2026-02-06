# Garden of Success - Admin Panel Guide

## 🔐 Login Credentials

**Default Password:** `garden2025`

**Important:** Change this password in the `script.js` file by modifying the `ADMIN_PASSWORD` constant (line ~264).

---

## 🎯 How to Access the Admin Panel

1. **Click the "Admin" button** in the top-right corner of the header
2. **Enter the password** when prompted
3. You'll be redirected to the Admin Panel

---

## 📝 Managing Blog Posts

### Adding a New Post

1. Go to the **Admin Panel** (click Admin button and login)
2. Make sure you're on the **"Manage Posts"** tab
3. Fill in the form:
   - **Title:** The headline of your post
   - **Date:** Publication date
   - **Tags:** Comma-separated (e.g., STEM, Events, Culture)
   - **Excerpt:** Brief summary (shown on blog list)
   - **Full Content:** Complete article text
4. Click **"Add Post"**

### Deleting a Post

1. Scroll down to **"Existing Posts"** section
2. Find the post you want to delete
3. Click the red **"Delete"** button
4. Confirm the deletion

---

## 🖼️ Managing Gallery Images

### Adding Images to Gallery

1. Go to the **Admin Panel**
2. Switch to the **"Manage Gallery"** tab
3. Select the gallery section:
   - **Classroom Activities**
   - **Sports & Games**
   - **School Events**
4. Paste the **image URL** (direct link to JPG, PNG, etc.)
5. Click **"Add Image"**

### Where to Get Image URLs

**Option 1: Upload to Free Image Hosting**
- [ImgBB](https://imgbb.com/) - Free, no account needed
- [Imgur](https://imgur.com/) - Popular image hosting
- [Cloudinary](https://cloudinary.com/) - Professional option

**Option 2: Use Existing URLs**
- Right-click any image online → "Copy image address"
- Make sure it's a direct link ending in .jpg, .png, .webp, etc.

### Deleting Gallery Images

1. In the **"Manage Gallery"** tab
2. Scroll to the section containing the image
3. **Hover over the image** you want to delete
4. Click the **red × button** that appears
5. Confirm the deletion

---

## 💾 Data Storage

All posts and gallery images are stored in your browser's **localStorage**. This means:

✅ **Pros:**
- No database needed
- Works offline
- Fast and simple

⚠️ **Cons:**
- Data is stored locally in your browser
- Clearing browser data will delete all posts/images
- Not accessible from other devices/browsers

### Backup Your Data

To backup your content:
1. Open **Browser Developer Tools** (F12)
2. Go to **Console** tab
3. Type: `localStorage.getItem('blogPosts')` - copy the output
4. Type: `localStorage.getItem('galleries')` - copy the output
5. Save these in a text file

### Restore from Backup

1. Open **Browser Developer Tools** (F12)
2. Go to **Console** tab
3. Paste your saved data:
   ```javascript
   localStorage.setItem('blogPosts', 'YOUR_SAVED_POSTS_DATA');
   localStorage.setItem('galleries', 'YOUR_SAVED_GALLERY_DATA');
   ```
4. Refresh the page

---

## 🔒 Security Notes

1. **Change the default password** in `script.js`
2. This is a **simple authentication system** - for production use, implement proper backend authentication
3. The password is stored in the code, so anyone who views the source can see it
4. Consider this a demonstration/prototype - upgrade to secure authentication for real-world use

---

## 🆘 Troubleshooting

### "Incorrect password" error
- Make sure you're using the correct password
- Check if you modified the password in `script.js`

### Images not showing in gallery
- Verify the URL is a direct image link (ends with .jpg, .png, etc.)
- Check if the image URL is accessible (try opening it in a new tab)
- Some websites block direct image linking (hotlinking)

### Posts/Images disappeared
- Check if browser data was cleared
- Restore from backup if available
- localStorage is browser-specific - data won't sync across devices

### Admin button not visible
- Make sure you're viewing on a desktop/laptop (button may be in mobile menu on small screens)
- Check if the page loaded correctly

---

## 📱 Mobile Access

On mobile devices:
1. Tap the **hamburger menu** (☰)
2. Scroll down to find **"Admin Login"** button
3. The admin panel works on mobile, but desktop is recommended for easier management

---

## 🎨 Customization

### Change Password Location
**File:** `script.js`  
**Line:** ~264  
**Code:** `const ADMIN_PASSWORD = "garden2025";`

### Modify Gallery Sections
**File:** `script.js`  
**Look for:** `GALLERIES` object  
You can add/remove gallery categories there

---

## ✨ Features Summary

✅ Password-protected admin access  
✅ Add/delete blog posts  
✅ Add/delete gallery images  
✅ Organize images by category  
✅ Preview all content before publishing  
✅ Mobile-responsive interface  
✅ Persistent storage (localStorage)  

---

**Need Help?** Check the console (F12) for any error messages.
