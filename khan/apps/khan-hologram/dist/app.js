const $=x=>document.getElementById(x);
async function j(path,opt){let r=await fetch(path,opt),d=await r.json();if(!r.ok)throw Error(d.message||d.error);return d}
async function refresh(){try{let [h,m,b]=await Promise.all([j("/api/health"),j("/api/missions"),j("/api/brain")]);
$("presence").textContent="CONTINUITY CORE ONLINE";$("integrity").textContent=h.integrity.verified?"INTEGRITY VERIFIED":"INTEGRITY FAILED";
$("status").innerHTML=`Identity: ${h.identity_id.slice(0,16)}…<br>Events: ${h.events}<br>Missions: ${h.missions}<br>Memories: ${h.memories}`;
$("missions").innerHTML=m.length?m.slice(0,8).map(x=>`<div class=card><b>${x.purpose}</b><br><small>${x.state}</small></div>`).join(""):"No missions";
$("brain").innerHTML=`${b.nodes.length} nodes<br>${b.edges.length} controlled connections`}catch(e){$("presence").textContent="RUNTIME UNREACHABLE";$("result").textContent=e.message}}
$("run").onclick=async()=>{try{$("result").textContent="Executing and verifying…";let d=await j("/api/missions/run",{method:"POST",headers:{"Content-Type":"application/json","X-Khan-Owner-Token":$("token").value},body:JSON.stringify({request:$("request").value})});$("result").textContent=JSON.stringify(d.result,null,2);refresh()}catch(e){$("result").textContent=e.message}};
$("refresh").onclick=refresh;refresh();setInterval(refresh,10000);
let c=$("bg"),x=c.getContext("2d"),pts=[];function size(){c.width=innerWidth;c.height=innerHeight;pts=Array.from({length:60},()=>[Math.random()*c.width,Math.random()*c.height])}size();onresize=size;
(function draw(){x.clearRect(0,0,c.width,c.height);x.strokeStyle="#00e5ff22";for(let i=0;i<pts.length;i++)for(let k=i+1;k<pts.length;k++){let a=pts[i],b=pts[k],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d<130){x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke()}}requestAnimationFrame(draw)})()
