"use strict";(()=>{var b="You are a helpful assistant integrated into the Geofy site. Keep answers concise.";function v(){let n=document.getElementsByTagName("script");return(n[n.length-1].getAttribute("data-api-base")||"").replace(/\/+$/,"")||""}function a(n,i,t){let e=document.createElement(n);return i&&(e.className=i),t&&(e.innerHTML=t),e}function w(){return`
#geofy-chat {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 360px;
  max-width: calc(100% - 48px);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  z-index: 999999;
}
#geofy-chat .gc-card{
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.16);
  overflow: hidden;
  border: 1px solid rgba(16,24,40,0.05);
}
#geofy-chat .gc-header {
  padding: 12px;
  display:flex;
  align-items:center;
  gap: 8px;
  border-bottom: 1px solid rgba(16,24,40,0.04);
}
#geofy-chat .gc-header .title { font-weight:600; }
#geofy-chat .gc-body { max-height:280px; overflow:auto; padding:10px; }
#geofy-chat .gc-msg { margin:8px 0; }
#geofy-chat .gc-msg .role { display:block; font-size:12px; color:#666; }
#geofy-chat .gc-input {
  display:flex;
  gap:8px;
  padding:10px;
  border-top:1px solid rgba(16,24,40,0.04);
}
#geofy-chat input.gc-text {
  flex:1;
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #e6e6e6;
}
#geofy-chat button.gc-send {
  padding:8px 12px;
  border-radius:8px;
  border: none;
  background:#2563eb;
  color:#fff;
  cursor:pointer;
}
#geofy-chat .gc-toggle {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: 0 8px 20px rgba(37,99,235,0.18);
  cursor:pointer;
  z-index: 999998;
}
`}async function M(n,i){var f,d,r,o,h,y,c;let t=n?`${n}/api/chat`:"/api/chat",e=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:i})});if(!e.ok){let u=await e.text();throw new Error(`API error ${e.status}: ${u}`)}let l=await e.json();return(c=(y=(r=(d=(f=l.choices)==null?void 0:f[0])==null?void 0:d.message)==null?void 0:r.content)!=null?y:(h=(o=l.choices)==null?void 0:o[0])==null?void 0:h.text)!=null?c:JSON.stringify(l)}function m(){let n=v(),i=document.createElement("style");i.innerHTML=w(),document.head.appendChild(i);let t=a("div",void 0,"");t.id="geofy-chat";let e=a("div","gc-card"),l=a("div","gc-header");l.innerHTML='<div class="title">Geofy Assistant</div><div style="margin-left:auto;font-size:12px;color:#666">Chat</div>';let g=a("div","gc-body"),f=a("div","gc-input"),d=a("input","gc-text");d.placeholder="Ask me about the site...";let r=a("button","gc-send");r.textContent="Send",f.appendChild(d),f.appendChild(r),e.appendChild(l),e.appendChild(g),e.appendChild(f),t.appendChild(e);let o=a("div","gc-toggle");o.innerHTML="&#128172;";let h=!1;function y(s){h=s,h?(document.body.contains(t)||document.body.appendChild(t),document.body.contains(o)&&(o.style.display="none")):(document.body.contains(t)&&document.body.removeChild(t),o.style.display="flex")}o.addEventListener("click",()=>y(!0)),document.body.appendChild(o),y(!1);let c=[{role:"system",content:b}];function u(){g.innerHTML="";for(let s of c.slice(1)){let p=a("div","gc-msg");p.innerHTML=`<div class="role">${s.role}</div><div class="content">${T(s.content)}</div>`,g.appendChild(p)}g.scrollTop=g.scrollHeight}async function x(){let s=d.value.trim();if(s){c.push({role:"user",content:s}),d.value="",u(),r.disabled=!0;try{let p=await M(n,c);c.push({role:"assistant",content:String(p)}),u()}catch(p){c.push({role:"assistant",content:"Error: "+(p.message||String(p))}),u()}finally{r.disabled=!1}}}r.addEventListener("click",x),d.addEventListener("keydown",s=>{s.key==="Enter"&&x()}),u()}function T(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();})();
//# sourceMappingURL=widget.js.map
