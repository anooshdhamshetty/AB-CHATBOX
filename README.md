# 🎮 AB-CHATBOX - Gaming AI Assistant

<div align="center">

**A cyberpunk-themed Chrome extension with AI chat, voice input, page summarization, and multiple export formats**

![Version](https://img.shields.io/badge/version-1.0.0-00ff88)
![Chrome](https://img.shields.io/badge/chrome-extension-00ffff)
![License](https://img.shields.io/badge/license-MIT-ff00ff)

</div>

---

## ✨ Features

🎤 **Voice Input** - Speak your questions instead of typing  
💬 **AI Chat** - Powered by Groq AI (llama-3.3-70b model)  
📄 **Page Summarization** - Summarize any webpage instantly  
📥 **Multiple Export Formats** - Save chats as TXT, PDF, RTF, or HTML  
🎨 **Gaming Theme** - Cyberpunk design with neon animations  
⚡ **Fast & Lightweight** - Runs locally in your browser  

---

## 📋 Prerequisites

✅ **Google Chrome** (or any Chromium-based browser like Edge, Brave)  
✅ **Groq API Key** (free - get it from [console.groq.com](https://console.groq.com))  
✅ **Working microphone** (for voice input feature)  

---

## 🚀 Installation Guide

### Step 1: Download the Extension

1. Download or clone this repository to your computer
2. Extract the files to a folder (e.g., `C:\abchatbox` or `~/abchatbox`)

### Step 2: Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)

### Step 3: Add Your API Key to the Extension

1. Open the `popup.js` file in a text editor
2. Find **line 46** (or search for `YOUR_GROQ_API_KEY_HERE`)
3. Replace it with your actual API key:
   ```javascript
   const GROQ_API_KEY = "gsk_YOUR_ACTUAL_KEY_HERE";
   ```
4. Save the file

### Step 4: Load Extension in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the folder containing the extension files
5. The **AB-CHATBOX** extension will appear in your extensions list

### Step 5: Pin the Extension (Optional)

1. Click the 🧩 **Extensions icon** in Chrome toolbar
2. Find **AB-CHATBOX**
3. Click the 📌 **pin icon** to keep it visible in your toolbar

---

## 🎤 Setting Up Microphone Access

**⚠️ IMPORTANT:** For voice input to work, you must grant microphone permission.

### Method 1: Quick Setup (When Using Voice Button)

1. Click the **AB-CHATBOX** icon in Chrome toolbar
2. Click the **🎤 VOICE** button
3. A popup will appear: *"AB-CHATBOX wants to use your microphone"*
4. Click **Allow**
5. ✅ Done! Voice input will now work

### Method 2: Manual Configuration

If the permission dialog doesn't appear automatically:

1. Go to `chrome://extensions/`
2. Find **AB-CHATBOX**
3. Click the **Details** button
4. Scroll down to **Site settings**
5. Under **Microphone**, select **Allow**
6. Close and reopen the extension popup

### Method 3: Chrome Settings

If voice still doesn't work:

1. Go to `chrome://settings/content/microphone`
2. Ensure **"Sites can ask to use your microphone"** is enabled
3. Make sure **AB-CHATBOX** is not in the blocked list
4. If it's blocked, click the 🗑️ icon to remove it
5. Reload the extension at `chrome://extensions/`

### Windows Microphone Privacy Settings

Ensure Windows allows Chrome to access your microphone:

1. Open **Windows Settings** → **Privacy & Security** → **Microphone**
2. Turn ON **"Microphone access"**
3. Turn ON **"Let apps access your microphone"**
4. Turn ON **"Let desktop apps access your microphone"**
5. Ensure **Google Chrome** is allowed

---

## 📖 How to Use

### 1️⃣ Chat with AI

1. Click the **AB-CHATBOX** icon in toolbar
2. Type your question in the input box
3. Click **💬 ASK** button
4. AI response will appear below

### 2️⃣ Voice Input

1. Click **🎤 VOICE** button
2. Allow microphone access (first time only)
3. Speak clearly when you see *"🎤 Listening..."*
4. Your speech will be transcribed into the input box
5. Click **💬 ASK** to send

### 3️⃣ Summarize Webpage

1. Navigate to any webpage you want to summarize
2. Click the **AB-CHATBOX** icon
3. Click **📋 SUMMARIZE PAGE** button
4. AI will read and summarize the page content

### 4️⃣ Export Conversation

1. After having a conversation, click **💾 EXPORT** button
2. Choose your preferred format:
   - **📄 TXT** - Plain text
   - **📕 PDF** - Formatted PDF document
   - **📘 RTF** - Rich Text Format (compatible with Word)
   - **🌐 HTML** - Styled web page
3. File will download automatically

### 5️⃣ Edit or Copy Messages

- **✏️ EDIT** - Modify the last message and resend
- **📋 COPY** - Copy AI response to clipboard
- **🗑️ CLEAR** - Clear entire conversation

---

## 🔧 Troubleshooting

### Voice Input Not Working

**Problem:** Microphone permission dialog doesn't appear  
**Solution:**  
1. Check [Microphone Access Setup](#-setting-up-microphone-access) above
2. Test your microphone in Chrome settings: `chrome://settings/content/microphone`
3. Try a different browser or restart Chrome

**Problem:** "Not allowed" or "Permission denied" error  
**Solution:**  
1. Go to `chrome://extensions/` → AB-CHATBOX → **Details** → **Site settings**
2. Set Microphone to **Allow**
3. Reload the extension

### API Errors

**Problem:** "Failed to fetch" or "API error"  
**Solution:**  
1. Check your internet connection
2. Verify your Groq API key is correct in `popup.js` (line 46)
3. Ensure you have API credits remaining at [console.groq.com](https://console.groq.com)

### Export Not Working

**Problem:** PDF export fails  
**Solution:**  
1. Ensure `jspdf.min.js` and `FileSaver.min.js` files are present in the extension folder
2. Reload the extension at `chrome://extensions/`

### Page Summarization Blocked

**Problem:** "Cannot access chrome:// URLs"  
**Solution:**  
- Chrome security prevents accessing browser internal pages (`chrome://`, `edge://`, etc.)
- Only regular web pages (http:// or https://) can be summarized

---

## 📁 File Structure

```
abchatbox/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── popup.css              # Gaming theme styles
├── popup.js               # Core functionality
├── background.js          # Service worker
├── content.js             # Page content extraction
├── jspdf.min.js          # PDF generation library
├── FileSaver.min.js      # File download library
├── icon16.svg            # 16x16 icon
├── icon48.svg            # 48x48 icon
├── icon128.svg           # 128x128 icon
└── README.md             # This file
```

---

## 🌐 Sharing with Others

Want to share this extension with friends or colleagues?

### Option 1: Share the Files
1. Zip the entire `abchatbox` folder
2. Send it to them
3. They follow the [Installation Guide](#-installation-guide) above

### Option 2: Publish to Chrome Web Store
1. Create a [Chrome Developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
2. Zip the extension files (exclude README and docs)
3. Upload to Chrome Web Store
4. Users can install with one click

---

## 🎨 Customization

### Change Colors
Edit `popup.css` to modify the color scheme:
- **Primary:** `#00ff88` (neon green)
- **Secondary:** `#00ffff` (cyan)
- **Accent:** `#ff00ff` (magenta)

### Change AI Model
Edit `popup.js` line 50 and 565 to use a different Groq model:
```javascript
model: "mixtral-8x7b-32768"  // or other Groq models
```

---

## 🔐 Privacy & Security

✅ **No data collection** - All processing happens locally or via Groq API  
✅ **Your API key stays private** - Stored only in your extension files  
✅ **No external tracking** - No analytics or third-party services  
✅ **Open source** - All code is visible and auditable  

**Note:** Your conversations are sent to Groq's servers for AI processing. Review [Groq's Privacy Policy](https://groq.com/privacy-policy/) for details.

---

## 📝 Version History

### v1.0.0 (March 2026)
- ✅ Initial release
- ✅ Gaming theme UI with animations
- ✅ Voice input with permission handling
- ✅ Multiple export formats (TXT, PDF, RTF, HTML)
- ✅ Page summarization
- ✅ Groq AI integration

---

## 🆘 Support

Having issues? Try these steps:

1. **Reload the extension:** `chrome://extensions/` → Click 🔄 on AB-CHATBOX
2. **Check console errors:** Right-click popup → Inspect → Console tab
3. **Verify API key:** Ensure it's correctly set in `popup.js`
4. **Test microphone:** `chrome://settings/content/microphone`
5. **Clear browser cache:** Settings → Privacy → Clear browsing data

---

## 📄 License

MIT License - Free to use, modify, and distribute.

---

## 🎮 Enjoy Your Gaming AI Assistant!

<div align="center">

Made with 💚 by the AB-CHATBOX Team

**[⭐ Star this project](#)** | **[🐛 Report a bug](#)** | **[💡 Request a feature](#)**

</div>
