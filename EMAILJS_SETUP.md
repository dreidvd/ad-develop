# 📧 EmailJS Setup Instructions

Your contact form is now set up to use EmailJS to send emails directly to `franzedavid67@gmail.com`.

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to: https://www.emailjs.com/
2. Click "Sign Up" (it's free)
3. Create an account (you can use your Google account)

### Step 2: Add Email Service
1. After logging in, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (since you're using Gmail)
4. Click **Connect Account** and authorize EmailJS to send emails from your Gmail
5. **Copy the Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use these settings:
   - **Template Name**: Portfolio Contact Form
   - **Subject**: New Contact Form Message: {{subject}}
   - **Content**:
   ```
   You have a new message from your portfolio website!
   
   From: {{from_name}}
   Email: {{from_email}}
   Subject: {{subject}}
   
   Message:
   {{message}}
   
   ---
   This email was sent from your portfolio contact form.
   ```
4. **Copy the Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find **Public Key** (also called User ID)
3. **Copy the Public Key** (looks like: `xxxxxxxxxxxxx`)

### Step 5: Update Your Code
Open `js/script.js` and replace these values:

```javascript
// Line ~97: Replace YOUR_PUBLIC_KEY with your Public Key
emailjs.init("YOUR_PUBLIC_KEY");

// Line ~113: Replace YOUR_SERVICE_ID with your Service ID
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
```

Example:
```javascript
emailjs.init("abc123xyz789");  // Your Public Key
emailjs.send("service_abc123", "template_xyz789", {  // Your Service ID and Template ID
```

### Step 6: Test It!
1. Open your website
2. Fill out the contact form
3. Submit it
4. Check your email at `franzedavid67@gmail.com`

## ✅ What You'll Receive

When someone fills out your contact form, you'll get an email like:

```
Subject: New Contact Form Message: [Their Subject]

You have a new message from your portfolio website!

From: John Doe
Email: john@example.com
Subject: Interested in collaboration

Message:
Hi, I'd like to work with you on a project...
```

## 🔒 Free Tier Limits

EmailJS free tier includes:
- **200 emails per month** (plenty for a portfolio!)
- All features you need
- No credit card required

## 🆘 Troubleshooting

**Not receiving emails?**
- Check your spam folder
- Verify Service ID, Template ID, and Public Key are correct
- Make sure you authorized Gmail in Step 2
- Check browser console for errors (F12)

**Need more help?**
- EmailJS Docs: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

---

Once you complete these steps, your contact form will send real emails! 🎉

