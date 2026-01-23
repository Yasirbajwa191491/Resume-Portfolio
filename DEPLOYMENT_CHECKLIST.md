# Vercel Deployment Checklist for Contact Form

## ✅ Step-by-Step Fix for 500 Error

### 1. Get Web3Forms Access Key
- [ ] Go to: https://web3forms.com/
- [ ] Enter email: yasirsohail191491@gmail.com
- [ ] Click "Create Access Key"
- [ ] **IMPORTANT:** Check email for verification link and click it
- [ ] Copy the access key (looks like: abc12345-6789-def0-1234-56789abcdef0)

### 2. Add Environment Variable in Vercel
- [ ] Go to: https://vercel.com/dashboard
- [ ] Click on project: portfolio-yasir
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Click "Add New"
- [ ] Enter:
  - Name: `WEB3FORMS_ACCESS_KEY`
  - Value: [paste your access key]
  - Environments: ✅ Production, ✅ Preview, ✅ Development
- [ ] Click "Save"

### 3. Redeploy Project
**IMPORTANT:** Environment variables only apply to NEW deployments!

**Option A - Trigger Redeploy from Dashboard:**
- [ ] Go to **Deployments** tab
- [ ] Click "..." menu on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

**Option B - Push to Git:**
```bash
cd C:\xampp\htdocs\resume\Resume-Portfolio
git add .
git commit -m "Update contact form error handling"
git push
```

**Option C - Vercel CLI:**
```bash
cd C:\xampp\htdocs\resume\Resume-Portfolio
vercel --prod
```

### 4. Test the Form
- [ ] Visit: https://portfolio-yasir.vercel.app/
- [ ] Scroll to contact form
- [ ] Fill in test data:
  - Name: Test User
  - Email: your-test-email@gmail.com
  - Message: Test message
- [ ] Click "Send Message"
- [ ] Should see: "✅ Message sent successfully!"
- [ ] Check your email: yasirsohail191491@gmail.com

### 5. Check Logs if Still Failing
- [ ] Go to Vercel dashboard → portfolio-yasir
- [ ] Click **Deployments** → Latest deployment
- [ ] Click **Functions** tab
- [ ] Click on `contact` function
- [ ] Look for errors in logs

## Common Errors & Solutions

### Error: "WEB3FORMS_ACCESS_KEY is undefined"
**Solution:** Environment variable not set. Follow Step 2 above and redeploy.

### Error: "Invalid access key"
**Solution:** 
- Access key is wrong, or
- Email not verified (check spam folder for Web3Forms verification email)

### Error: "Access key not found"
**Solution:** Get a fresh access key from https://web3forms.com/

### Error: "fetch is not defined"
**Solution:** Add Node.js version in package.json (create if doesn't exist):
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Still getting 500 error?
1. Check function logs in Vercel (detailed error will be there)
2. Test directly: https://portfolio-yasir.vercel.app/api/contact
3. Should see: {"success":false,"message":"Method not allowed"}
4. If you see that, the function works! Issue is in form submission

## Testing Checklist
- [ ] Form shows "Sending..." when clicked
- [ ] Success message appears after submission
- [ ] Form resets after success
- [ ] Email arrives at yasirsohail191491@gmail.com
- [ ] Can reply directly to visitor's email

## Need Help?
1. Check Vercel function logs for exact error
2. Verify environment variable is set correctly
3. Make sure you redeployed after adding env var
4. Test Web3Forms key at: https://web3forms.com/#test
