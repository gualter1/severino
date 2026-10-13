/**
 * 🖥️ Dashboard HTML — Kanban das Casas (GitHub dark, CSS puro, local-first).
 * Servido em GET /ui e GET / pelo WebChannel.
 * Consome: GET /engine/quadro?houseId=, GET /engine/fila,
 *          POST /engine/cartas, POST /engine/quadro/mover, POST /engine/grill.
 */

export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>🏠 Severino Engine — Quadro das Casas</title>
<style>
  :root { --bg:#0d1117; --panel:#161b22; --panel2:#1c2128; --border:#30363d;
    --fg:#e6edf3; --muted:#8b949e; --accent:#58a6ff; --green:#3fb950; --yellow:#d29922; --red:#f85149; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }
  header { padding:16px 24px; border-bottom:1px solid var(--border); display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:18px; margin:0; }
  header .sub { color:var(--muted); font-size:13px; }
  main { padding:20px 24px 60px; max-width:1280px; margin:0 auto; }
  .row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin:12px 0; }
  .tabs button, .btn { background:var(--panel2); color:var(--fg); border:1px solid var(--border); border-radius:8px; padding:8px 14px; cursor:pointer; font-size:14px; }
  .tabs button.ativo, .btn.primario { background:#1f6feb; border-color:#1f6feb; color:#fff; }
  .btn:hover, .tabs button:hover { filter:brightness(1.15); }
  .btn.pequeno { padding:4px 10px; font-size:12px; }
  .grid-kanban { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:12px; }
  @media (max-width:900px){ .grid-kanban{ grid-template-columns:1fr 1fr; } }
  @media (max-width:600px){ .grid-kanban{ grid-template-columns:1fr; } }
  .col { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:12px; min-height:220px; }
  .col h2 { font-size:13px; margin:0 0 10px; letter-spacing:.04em; display:flex; justify-content:space-between; }
  .col h2 .n { background:var(--panel2); border:1px solid var(--border); border-radius:20px; padding:0 8px; font-size:12px; color:var(--muted); }
  .carta { background:var(--panel2); border:1px solid var(--border); border-left:3px solid var(--accent); border-radius:8px; padding:8px 10px; margin-bottom:8px; font-size:13px; }
  .carta .obj { margin:0 0 6px; word-break:break-word; }
  .carta .meta { color:var(--muted); font-size:11px; margin-bottom:6px; }
  .carta select { background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:6px; font-size:12px; padding:3px 6px; }
  .painel { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:14px; margin-top:16px; }
  .painel h2 { font-size:15px; margin:0 0 10px; }
  input, textarea { background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:14px; width:100%; }
  textarea { min-height:56px; resize:vertical; }
  label { font-size:12px; color:var(--muted); display:block; margin:8px 0 4px; }
  .duas { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media (max-width:800px){ .duas{ grid-template-columns:1fr; } }
  #fila li, #grillResult { font-size:13px; }
  #fila { padding-left:18px; }
  #fila li { margin-bottom:4px; }
  .ok { color:var(--green); } .erro { color:var(--red); } .aviso { color:var(--yellow); }
  pre { background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:10px; overflow:auto; font-size:12px; max-height:220px; }
  footer { color:var(--muted); font-size:12px; text-align:center; padding:24px; }
</style>
</head>
<body>
<header>
  <h1>🏠 Severino Engine</h1>
  <span class="sub">Quadro das Casas · Local-First · Zero Telemetry</span>
  <span class="sub" id="status">…</span>
</header>
<main>
  <div class="row tabs" id="houseTabs">
    <button data-house="casa-dev" class="ativo">🛠️ casa-dev</button>
    <button data-house="casa-negocios">💼 casa-negocios</button>
    <button data-house="casa-dados">📊 casa-dados</button>
    <button class="btn" id="btnAtualizar" title="Recarregar quadro + fila">↻ Atualizar</button>
    <label style="display:inline-flex;gap:6px;align-items:center;"><input type="checkbox" id="auto" style="width:auto;" /> auto 10s</label>
  </div>

  <div class="grid-kanban" id="kanban">
    <div class="col" data-col="A_FAZER"><h2>📥 A_FAZER <span class="n">0</span></h2><div class="lista"></div></div>
    <div class="col" data-col="FAZENDO"><h2>🔨 FAZENDO <span class="n">0</span></h2><div class="lista"></div></div>
    <div class="col" data-col="EM_REVIEW"><h2>👀 EM_REVIEW <span class="n">0</span></h2><div class="lista"></div></div>
    <div class="col" data-col="PRONTO"><h2>✅ PRONTO <span class="n">0</span></h2><div class="lista"></div></div>
  </div>

  <div class="duas">
    <div class="painel">
      <h2>✉️ Nova carta <span class="sub">POST /engine/cartas</span></h2>
      <label>Objetivo</label>
      <textarea id="fObjective" placeholder="Ex: Criar endpoint de login com JWT"></textarea>
      <div class="row">
        <div style="flex:1"><label>Prioridade (1–5)</label><input id="fPriority" type="number" min="1" max="5" value="3" /></div>
        <div style="flex:2"><label>domainHint (opcional)</label><input id="fDomain" placeholder="backend, frontend, qa…" /></div>
      </div>
      <div class="row"><button class="btn primario" id="btnEnviar">Enviar carta</button><span id="envioMsg"></span></div>
    </div>
    <div class="painel">
      <h2>📋 Fila externa <span class="sub">GET /engine/fila</span></h2>
      <div class="row"><span id="filaTotal" class="sub">…</span><button class="btn pequeno" id="btnFila">↻ fila</button></div>
      <ul id="fila"></ul>
    </div>
  </div>

  <div class="painel">
    <h2>🔥 Grill-me (opt-in, ADR-002 §8) <span class="sub">POST /engine/grill</span></h2>
    <div class="row">
      <div style="flex:1"><label>cartaId</label><input id="gCarta" placeholder="carta-…" /></div>
      <div style="flex:3"><label>objective / opiniões (separadas por linha)</label><input id="gObj" placeholder="Ex: mudar schema de auth — irreversível?" /></div>
      <div><label>&nbsp;</label><button class="btn" id="btnGrill">Rodar grill</button></div>
    </div>
    <div id="grillResult"></div>
  </div>

  <div class="painel">
    <h2>🧾 Resposta crua (debug)</h2>
    <pre id="raw">—</pre>
  </div>
</main>
<footer>Severino Engine · <span id="houseAtual">casa-dev</span> · endpoints: /engine/quadro · /engine/fila · /engine/cartas · /engine/grill</footer>
<script>
var houseAtual = "casa-dev";
var COLUNAS = ["A_FAZER","FAZENDO","EM_REVIEW","PRONTO"];
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function raw(o){ document.getElementById("raw").textContent = typeof o==="string"?o:JSON.stringify(o,null,2); }
function setStatus(t,cls){ var el=document.getElementById("status"); el.textContent=t; el.className="sub "+(cls||""); }

async function carregarQuadro(){
  setStatus("carregando "+houseAtual+"…");
  try{
    var r = await fetch("/engine/quadro?houseId="+encodeURIComponent(houseAtual));
    var data = await r.json();
    raw(data);
    if(!r.ok){ setStatus("erro: "+(data.error||r.status),"erro"); return; }
    var cols = data.colunas||{};
    COLUNAS.forEach(function(c){
      var box = document.querySelector('.col[data-col="'+c+'"] .lista');
      var itens = cols[c]||[];
      document.querySelector('.col[data-col="'+c+'"] .n').textContent = itens.length;
      box.innerHTML = itens.length? "" : '<div class="sub" style="color:#8b949e;font-size:12px">— vazio —</div>';
      itens.forEach(function(it){
        var carta = it.carta||{};
        var id = carta.cartaId||"?";
        var div = document.createElement("div");
        div.className = "carta";
        var opts = COLUNAS.filter(function(x){return x!==c;}).map(function(x){
          return '<option value="'+x+'">'+x+'</option>';
        }).join("");
        div.innerHTML = '<p class="obj">'+esc(carta.objective||"(sem objetivo)")+'</p>'+
          '<div class="meta">'+esc(id)+' · p'+esc(carta.priority)+' · '+esc(it.quarto||"")+'</div>'+
          '<div class="row" style="margin:0"><select>'+opts+'</select> '+
          '<button class="btn pequeno">mover →</button></div>';
        var btn = div.querySelector("button");
        var sel = div.querySelector("select");
        btn.onclick = function(){ moverCarta(id, c, sel.value, btn); };
        box.appendChild(div);
      });
    });
    document.getElementById("houseAtual").textContent = houseAtual;
    setStatus("ok · "+houseAtual,"ok");
  }catch(e){ setStatus("falha de rede: "+e.message,"erro"); }
}

async function moverCarta(cartaId, de, para, btn){
  btn.disabled = true; btn.textContent = "movendo…";
  try{
    var r = await fetch("/engine/quadro/mover",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({houseId:houseAtual,cartaId:cartaId,de:de,para:para})});
    var data = await r.json(); raw(data);
    if(!r.ok){ alert("Mover falhou: "+(data.error||r.status)); }
    await carregarQuadro();
  }catch(e){ alert("Rede: "+e.message); btn.disabled=false; btn.textContent="mover →"; }
}

async function carregarFila(){
  try{
    var r = await fetch("/engine/fila");
    var data = await r.json();
    document.getElementById("filaTotal").textContent = "tamanho: "+(data.tamanho||0);
    var ul = document.getElementById("fila"); ul.innerHTML="";
    (data.cartas||[]).forEach(function(c){
      var li=document.createElement("li");
      li.textContent = (c.cartaId||"?")+" · p"+c.priority+" · "+(c.objective||"").slice(0,90);
      ul.appendChild(li);
    });
    if(!(data.cartas||[]).length) ul.innerHTML='<li style="color:#8b949e">fila vazia</li>';
  }catch(e){ document.getElementById("filaTotal").textContent = "erro: "+e.message; }
}

document.getElementById("btnEnviar").onclick = async function(){
  var msg = document.getElementById("envioMsg"); msg.textContent = "enviando…";
  try{
    var r = await fetch("/engine/cartas",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({objective:document.getElementById("fObjective").value,
        priority:Number(document.getElementById("fPriority").value)||3,
        domainHint:document.getElementById("fDomain").value||undefined})});
    var data = await r.json(); raw(data);
    msg.textContent = r.ok? "✓ carta "+((data.carta||{}).cartaId||"criada") : "✗ "+(data.error||r.status);
    msg.className = r.ok? "ok":"erro";
    document.getElementById("fObjective").value="";
    await carregarQuadro(); await carregarFila();
  }catch(e){ msg.textContent = "rede: "+e.message; msg.className="erro"; }
};

document.getElementById("btnGrill").onclick = async function(){
  var out = document.getElementById("grillResult"); out.textContent = "grelhando…";
  try{
    var r = await fetch("/engine/grill",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({cartaId:document.getElementById("gCarta").value,
        objective:document.getElementById("gObj").value})});
    var data = await r.json(); raw(data);
    out.innerHTML = r.ok
      ? '<p><b>Consenso:</b> '+esc(data.consenso)+'</p><p class="sub">votantes: '+esc(data.votantes)+' · dissenso: '+(data.dissentimento?'<span class="aviso">sim (tech-lead decidiu)</span>':'<span class="ok">não</span>')+'</p>'
      : '<p class="erro">✗ '+(esc(data.error||r.status))+'</p>';
  }catch(e){ out.innerHTML = '<p class="erro">rede: '+esc(e.message)+'</p>'; }
};

document.querySelectorAll("#houseTabs button[data-house]").forEach(function(b){
  b.onclick = function(){
    document.querySelectorAll("#houseTabs button[data-house]").forEach(function(x){x.classList.remove("ativo");});
    b.classList.add("ativo"); houseAtual = b.getAttribute("data-house"); carregarQuadro();
  };
});
document.getElementById("btnAtualizar").onclick = function(){ carregarQuadro(); carregarFila(); };
document.getElementById("btnFila").onclick = carregarFila;
var timer=null;
document.getElementById("auto").onchange = function(e){
  if(e.target.checked){ timer=setInterval(function(){carregarQuadro();carregarFila();},10000); }
  else if(timer){ clearInterval(timer); timer=null; }
};
carregarQuadro(); carregarFila();
</script>
</body>
</html>`;
}
