const GROQ_API_KEY = "please paste your groq api key here";
const MODEL = "llama-3.1-8b-instant";

const promptBox = document.getElementById("prompt");
const responseBox = document.getElementById("response");
const typingIndicator = document.getElementById("typingIndicator");
const exportModal = document.getElementById("exportModal");
const voiceModal = document.getElementById("voiceModal");

const closeButtons = document.querySelectorAll(".close, .close-voice");

closeButtons.forEach(btn=>{
btn.onclick=()=>{
exportModal.classList.remove("active");
voiceModal.classList.remove("active");
};
});

window.onclick=(event)=>{
if(event.target===exportModal || event.target===voiceModal){
exportModal.classList.remove("active");
voiceModal.classList.remove("active");
}
};



// =======================
// ASK BUTTON
// =======================

document.getElementById("ask").onclick = async () => {

const prompt = promptBox.value.trim();

if(!prompt){
showNotification("⚠️ Please enter a message!");
return;
}

responseBox.innerHTML =
"<div style='text-align:center;color:#00ff88;'>⚡ Generating response...</div>";

typingIndicator.classList.add("active");

try{

const res = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${GROQ_API_KEY}`
},
body:JSON.stringify({
model: MODEL,
messages:[
{
role:"user",
content: prompt
}
]
})
}
);

const data = await res.json();

if(!res.ok){
throw new Error(data.error?.message || "API error");
}

const text =
data.choices?.[0]?.message?.content ||
"No response received";

typeWriter(text,responseBox);

}
catch(error){

responseBox.innerHTML =
`<div style="color:#ff0044;">❌ ${error.message}</div>`;

}
finally{

typingIndicator.classList.remove("active");

}

};



// =======================
// TYPEWRITER EFFECT
// =======================

function typeWriter(text,element,speed=10){

element.innerHTML="";
let i=0;

function type(){

if(i<text.length){

element.innerHTML += text.charAt(i);
i++;

setTimeout(type,speed);

element.scrollTop = element.scrollHeight;

}else{
// Format the content after typing is complete
formatResponse(element);
}

}

type();

}



// =======================
// FORMAT RESPONSE WITH CODE BLOCKS
// =======================

function formatResponse(element){

let content = element.innerText;

// Format code blocks (```language ... ```)
content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, language, code){
const lang = language || 'code';
return `<div class="code-block">
<div class="code-header">${lang}</div>
<pre><code>${escapeHtml(code.trim())}</code></pre>
</div>`;
});

// Format inline code (`code`)
content = content.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

// Format paragraphs (double line breaks)
content = content.split('\n\n').map(para => {
if(!para.includes('<div class="code-block">') && para.trim()){
return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
}
return para;
}).join('\n');

element.innerHTML = content;

}

function escapeHtml(text){
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}



// =======================
// GET FORMATTED TEXT (for exports)
// =======================

function getFormattedText(){

let content = responseBox.innerText;

// Preserve code block structure for plain text
content = content.replace(/```(\w+)?\n/g, '\n--- CODE ($1) ---\n');
content = content.replace(/```/g, '\n--- END CODE ---\n');

return content;

}

function getFormattedHtml(){

let content = responseBox.innerText;

// Format code blocks with proper HTML
content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, language, code){
const lang = language || 'code';
return `<div style="background:#1e1e1e;border-radius:6px;margin:16px 0;overflow:hidden;">
<div style="background:#2d2d2d;padding:8px 16px;color:#00ff88;font-size:12px;font-weight:600;">${escapeHtml(lang)}</div>
<pre style="padding:16px;margin:0;overflow-x:auto;"><code style="color:#d4d4d4;font-family:'Courier New',monospace;font-size:13px;line-height:1.6;">${escapeHtml(code.trim())}</code></pre>
</div>`;
});

// Format inline code
content = content.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-family:monospace;color:#e83e8c;">$1</code>');

// Format paragraphs
content = content.split('\n\n').map(para => {
if(!para.includes('<div style=') && para.trim()){
return '<p style="margin:12px 0;line-height:1.6;">' + para.replace(/\n/g, '<br>') + '</p>';
}
return para;
}).join('\n');

return content;

}



// =======================
// NOTIFICATION
// =======================

function showNotification(message){

responseBox.innerHTML =
`<div style="text-align:center;color:#ffd700;">${message}</div>`;

setTimeout(()=>{
responseBox.innerHTML="";
},2000);

}



// =======================
// CLEAR BUTTON
// =======================

document.getElementById("clear").onclick=()=>{
promptBox.value="";
responseBox.innerHTML="";
};



// =======================
// EDIT BUTTON
// =======================

document.getElementById("edit").onclick=()=>{
promptBox.focus();
};



// =======================
// COPY BUTTON
// =======================

document.getElementById("copy").onclick=()=>{

const text=responseBox.innerText;

if(!text){
showNotification("⚠️ No content to copy!");
return;
}

navigator.clipboard.writeText(text);

showNotification("📋 Copied!");

};



// =======================
// EXPORT BUTTON
// =======================

document.getElementById("export").onclick=()=>{

if(!responseBox.innerText.trim()){
showNotification("⚠️ Nothing to export!");
return;
}

exportModal.classList.add("active");

};



// TXT EXPORT

document.getElementById("exportTxt").onclick=()=>{

const text=getFormattedText();

const blob=new Blob([text],{type:"text/plain"});

downloadFile(blob,"AB-CHATBOX.txt");

exportModal.classList.remove("active");
showNotification("📝 Exported as TXT!");

};



// PDF EXPORT

document.getElementById("exportPdf").onclick=()=>{

try{

const {jsPDF}=window.jspdf;

const doc=new jsPDF();

const text=getFormattedText();

const lines=doc.splitTextToSize(text,180);

doc.setFontSize(12);

let yPosition = 15;
const pageHeight = doc.internal.pageSize.height;
const lineHeight = 7;

lines.forEach(line => {
// Check if we need a new page
if(yPosition + lineHeight > pageHeight - 20){
doc.addPage();
yPosition = 15;
}

// Use monospace font for code sections
if(line.includes('--- CODE') || line.includes('--- END CODE ---')){
doc.setFont('courier', 'bold');
doc.setFontSize(10);
}else if(yPosition > 15 && lines[lines.indexOf(line)-1] && lines[lines.indexOf(line)-1].includes('--- CODE')){
doc.setFont('courier', 'normal');
doc.setFontSize(9);
}else{
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
}

doc.text(line, 15, yPosition);
yPosition += lineHeight;
});

doc.save("AB-CHATBOX.pdf");

exportModal.classList.remove("active");
showNotification("📕 Exported as PDF!");

}catch(error){
showNotification("❌ PDF export failed!");
}

};



// RTF EXPORT (Word Compatible)

document.getElementById("exportDocx").onclick=()=>{

try{

const text=getFormattedText();

// Enhanced RTF with code formatting
const rtfContent=`{\\\\rtf1\\\\ansi\\\\deff0
{\\\\fonttbl{\\\\f0\\\\fswiss Arial;}{\\\\f1\\\\fmodern Courier New;}}
{\\\\colortbl;\\\\red0\\\\green255\\\\blue136;\\\\red0\\\\green0\\\\blue0;\\\\red240\\\\green240\\\\blue240;}
{\\\\*\\\\generator AB-CHATBOX;}
\\\\viewkind4\\\\uc1\\\\pard\\\\cf1\\\\f0\\\\fs32\\\\b AB-CHATBOX Response\\\\b0\\\\fs24\\\\par
\\\\par
\\\\cf2 ${text
.replace(/\\\\/g,'\\\\\\\\')
.replace(/\\n--- CODE \\((\\w+)\\) ---\\n/g,'\\\\par\\\\highlight3\\\\f1\\\\fs20\\\\b CODE: $1\\\\b0\\\\par\\n')
.replace(/\\n--- END CODE ---\\n/g,'\\\\highlight0\\\\f0\\\\fs24\\\\par\\n')
.replace(/\\n/g,'\\\\par\\n')
.replace(/{/g,'\\\\{')
.replace(/}/g,'\\\\}')}\\\\par
}`;

const blob=new Blob([rtfContent],{type:"application/rtf"});

downloadFile(blob,"AB-CHATBOX.rtf");

exportModal.classList.remove("active");
showNotification("📘 Exported as RTF!");

}catch(error){
showNotification("❌ RTF export failed!");
}

};



// HTML EXPORT

document.getElementById("exportHtml").onclick=()=>{

const formattedContent = getFormattedHtml();

const htmlContent=`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AB-CHATBOX Response</title>
<style>
body{
font-family:'Segoe UI',Arial,sans-serif;
max-width:900px;
margin:50px auto;
padding:20px;
background:#f5f5f5;
line-height:1.6;
}
.container{
background:white;
padding:40px;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,0.1);
}
h1{
color:#00ff88;
border-bottom:3px solid #00ff88;
padding-bottom:10px;
margin-top:0;
}
.content{
line-height:1.8;
color:#333;
}
.content p{
margin:12px 0;
}
.content code{
background:#f0f0f0;
padding:2px 6px;
border-radius:3px;
font-family:'Courier New',monospace;
color:#e83e8c;
font-size:0.9em;
}
.code-block{
background:#1e1e1e;
border-radius:6px;
margin:20px 0;
overflow:hidden;
}
.code-header{
background:#2d2d2d;
padding:8px 16px;
color:#00ff88;
font-size:12px;
font-weight:600;
text-transform:uppercase;
}
.code-block pre{
padding:16px;
margin:0;
overflow-x:auto;
}
.code-block code{
color:#d4d4d4;
font-family:'Courier New',monospace;
font-size:13px;
line-height:1.6;
background:transparent;
padding:0;
}
</style>
</head>
<body>
<div class="container">
<h1>🎮 AB-CHATBOX Response</h1>
<div class="content">
${formattedContent}
</div>
</div>
</body>
</html>`;

const blob=new Blob([htmlContent],{type:"text/html"});

downloadFile(blob,"AB-CHATBOX.html");

exportModal.classList.remove("active");
showNotification("🌐 Exported as HTML!");

};



// =======================
// DOWNLOAD FILE
// =======================

function downloadFile(blob,filename){

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download=filename;

document.body.appendChild(a);
a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

}



// =======================
// VOICE INPUT
// =======================

document.getElementById("voice").onclick=async()=>{

console.log("🎤 Voice button clicked");

// Check browser support
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
console.error("❌ Speech Recognition not supported");
showNotification("❌ Voice not supported. Use Chrome or Edge.");
return;
}

console.log("✅ Speech Recognition is supported");

// Show modal
voiceModal.classList.add("active");

const voiceStatus = document.getElementById("voiceStatus");
voiceStatus.innerText="🎤 Requesting microphone access...";

// First, request explicit permission using getUserMedia
try{
console.log("Requesting microphone permission via getUserMedia...");
const stream = await navigator.mediaDevices.getUserMedia({audio:true});
console.log("✅ Microphone permission granted!");
// Stop the stream immediately
stream.getTracks().forEach(track=>track.stop());
}catch(permError){
console.error("❌ Permission denied:",permError);
voiceStatus.innerText="❌ Microphone permission denied. Please allow access from browser settings.";
setTimeout(()=>{
voiceModal.classList.remove("active");
},4000);
return;
}

// Now start speech recognition
const recognition = new SpeechRecognition();

recognition.lang="en-US";
recognition.continuous=false;
recognition.interimResults=false;

recognition.onstart=()=>{
console.log("✅ Recognition started");
voiceStatus.innerText="🎤 Listening... Speak now!";
};

recognition.onresult=(event)=>{
console.log("✅ Result received:",event.results);

const transcript = event.results[0][0].transcript;
console.log("📝 Transcript:",transcript);

promptBox.value = transcript;
voiceStatus.innerText="✅ Captured: "+transcript;

setTimeout(()=>{
voiceModal.classList.remove("active");
},1500);
};

recognition.onerror=(event)=>{
console.error("❌ Recognition error:",event.error);

let errorMsg;
switch(event.error){
case "not-allowed":
case "permission-denied":
errorMsg="Microphone blocked. Go to chrome://extensions/ → AB-CHATBOX → Site settings → Allow microphone";
break;
case "no-speech":
errorMsg="No speech detected. Please try again and speak clearly.";
break;
case "audio-capture":
errorMsg="No microphone found. Connect a microphone and try again.";
break;
case "network":
errorMsg="Network error occurred.";
break;
case "aborted":
errorMsg="Recognition aborted. Try again.";
break;
default:
errorMsg=event.error;
}

voiceStatus.innerText="❌ "+errorMsg;

setTimeout(()=>{
voiceModal.classList.remove("active");
},5000);
};

recognition.onend=()=>{
console.log("✅ Recognition ended");
};

// Start recognition
try{
console.log("🎤 Starting recognition...");
voiceStatus.innerText="🎤 Starting... Please speak clearly!";
recognition.start();
}catch(error){
console.error("❌ Failed to start:",error);
voiceStatus.innerText="❌ Failed: "+error.message;
setTimeout(()=>{
voiceModal.classList.remove("active");
},3000);
}

};



// =======================
// SUMMARIZE PAGE
// =======================

document.getElementById("summarize").onclick = async ()=>{

try{

const [tab] = await chrome.tabs.query({
active:true,
currentWindow:true
});

// Check if URL is accessible
if(tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("edge://")){
responseBox.innerHTML="<div style='color:#ff0044;'>❌ Cannot access browser internal pages. Please open a regular webpage.</div>";
return;
}

responseBox.innerHTML =
"<div style='text-align:center;color:#ffd700;'>📄 Extracting page...</div>";

await chrome.scripting.executeScript({
target:{tabId:tab.id},
files:["content.js"]
});

await new Promise(resolve=>setTimeout(resolve,100));

chrome.tabs.sendMessage(
tab.id,
{action:"getText"},
async(response)=>{

if(chrome.runtime.lastError){
responseBox.innerHTML=`<div style='color:#ff0044;'>❌ Error: ${chrome.runtime.lastError.message}</div>`;
return;
}

if(!response || !response.text){
responseBox.innerHTML="❌ Could not read page";
return;
}

const pageText=response.text.slice(0,8000);

responseBox.innerHTML =
"<div style='text-align:center;color:#00ff88;'>⚡ Generating summary...</div>";

typingIndicator.classList.add("active");

try{

const res = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${GROQ_API_KEY}`
},
body:JSON.stringify({
model: MODEL,
messages:[
{
role:"user",
content:`Summarize the following webpage:\n\n${pageText}`
}
]
})
}
);

const data = await res.json();

const summary =
data.choices?.[0]?.message?.content ||
"Summary failed";

typeWriter(summary,responseBox);

}
catch(error){

responseBox.innerHTML =
`<div style="color:#ff0044;">❌ ${error.message}</div>`;

}
finally{

typingIndicator.classList.remove("active");

}

});

}catch(error){

responseBox.innerHTML=`<div style='color:#ff0044;'>❌ Cannot access this page: ${error.message}</div>`;

}

};



// =======================
// ENTER KEY SEND
// =======================

promptBox.addEventListener("keypress",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

document.getElementById("ask").click();

}

});