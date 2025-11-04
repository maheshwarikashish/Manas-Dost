# Database Setup Guide

## MongoDB Connection Error - Quick Fix

If you're seeing a database connection error, follow these steps:

### Option 1: Fix MongoDB Atlas IP Whitelist (Recommended for Cloud)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Add Your IP Address**
   - Click on **Network Access** in the left sidebar
   - Click **Add IP Address**
   - Click **Add Current IP Address** (or manually enter your IP)
   - For development only, you can use `0.0.0.0/0` to allow all IPs (⚠️ NOT for production)

3. **Wait 2-3 minutes** for changes to propagate

4. **Verify Connection String**
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - It should look like: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

### Option 2: Use Local MongoDB (For Development)

1. **Install MongoDB locally**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use Homebrew: `brew install mongodb-community`

2. **Start MongoDB**
   - Windows: MongoDB should start as a service automatically
   - Mac/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`

3. **Update .env file**
   ```
   MONGO_URI=mongodb://localhost:27017/manas-dost
   ```

### Creating the .env File

1. **Create a `.env` file** in the `server` directory (same folder as `server.js`)

2. **Add the following variables:**
   ```env
   # MongoDB Connection String
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manas-dost?retryWrites=true&w=majority
   
   # Server Port
   PORT=5000
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   
   # Gemini API Key (get from https://makersuite.google.com/app/apikey)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Replace the values:**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Any random string (e.g., use `openssl rand -base64 32` to generate)
   - `GEMINI_API_KEY`: Your Google Gemini API key (optional for AI features)

### Common Issues

#### Issue: "IP not whitelisted"
**Solution:** Add your IP to MongoDB Atlas Network Access (see Option 1 above)

#### Issue: "Authentication failed"
**Solution:** 
- Check username/password in connection string
- URL-encode special characters in password (e.g., `@` becomes `%40`)
- Verify database user has proper permissions

#### Issue: "Connection timeout"
**Solution:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Check firewall settings

### Testing the Connection

After setting up your `.env` file, restart the server:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully!
📊 Database: manas-dost
🔗 Host: cluster0.xxxxx.mongodb.net
```

### Need Help?

If you're still having issues:
1. Check the error message in the terminal - it now provides specific guidance
2. Verify your `.env` file is in the correct location (`server/.env`)
3. Make sure there are no extra spaces in your `.env` file
4. Try using local MongoDB for development


