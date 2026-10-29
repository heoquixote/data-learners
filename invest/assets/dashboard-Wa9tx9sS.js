import{f as _t,a as qt,b as Qt,c as jt,d as O,e as Gt,g as Ot,h as Lt,t as zt,i as Q,j as Yt,k as Zt,l as Xt,m as Jt,n as te,s as st,o as ee,p as ne}from"./index-XlFNxhMe.js";function pt(t,e={}){const{onToggleFavorite:o}=e,a=t.dailyChangePercent??t.changePercent??0,n=t.monthlyChangePercent??null,s=a===0,l=a>0,r=s?"neutral":l?"up":"down",c=t.currency==="KRW"?"₩":"$",d=oe(t.price,t.currency),f=s?"":l?"▲":"▼",i=`${f?`${f} `:""}${Math.abs(a).toFixed(2)}%`;let g="";if(n!=null){const E=n>=0;g=`
          <div class="stock-monthly ${E?"up":"down"}">
            <span class="monthly-label">전월비</span>
            <span class="monthly-value">${E?"▲":"▼"} ${Math.abs(n).toFixed(2)}%</span>
          </div>`}const u=document.createElement("div");u.className=`stock-card ${r}`,u.dataset.symbol=t.symbol,u.dataset.favorite=t.isFavorite?"true":"false",t.symbol.includes(".KS")||t.symbol.includes(".KQ");const v=t.symbol.replace(".KS","").replace(".KQ",""),y=t.name||v,h=v,p=t.isFavorite?"active":"",b=t.isFavorite?"즐겨찾기 해제":"즐겨찾기 추가";u.innerHTML=`
    <div class="stock-card-header">
      <div>
        <div class="stock-symbol">${y}</div>
        <div class="stock-name">${h}</div>
      </div>
      <div class="stock-card-actions">
        ${t.recommendation?`
          <span class="stock-badge ${ae(t.recommendation)}">${t.recommendation}</span>
        `:""}
        <button class="stock-favorite-btn ${p}" type="button" data-favorite-symbol="${t.symbol}" aria-label="${b}">
          ★
        </button>
      </div>
    </div>
    <div class="stock-card-body">
      <div class="stock-price">${c}${d}</div>
      <div class="stock-change">
        <div class="stock-daily">
          <span class="daily-label">전일비</span>
          <span class="stock-change-percent">${i}</span>
        </div>
        ${g}
      </div>
    </div>
    <button class="stock-chart-link" type="button" data-chart-symbol="${t.symbol}" aria-label="${y} 차트 열기">
      <canvas class="stock-sparkline" id="sparkline-${t.symbol.replace(/[^a-zA-Z0-9]/g,"_")}"></canvas>
    </button>
  `;const S=u.querySelector(".stock-favorite-btn");return S&&typeof o=="function"&&S.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),o(t.symbol)}),u}function ae(t){return t?t.includes("매수")||t==="BUY"?"buy":t.includes("매도")||t==="SELL"?"sell":"hold":""}function oe(t,e){return t?e==="KRW"?Math.round(t).toLocaleString():t.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}):"0"}function Bt(t,e,o){const a=document.getElementById(t);if(!a||!e.length)return;const n=a.getContext("2d"),s=a.getBoundingClientRect();a.width=s.width*2,a.height=s.height*2,n.scale(2,2);const l=s.width,r=s.height,c=4,d=e.map(p=>p.close||p.price||0).filter(p=>p>0);if(d.length<2)return;const f=Math.min(...d),g=Math.max(...d)-f||1,u=getComputedStyle(document.documentElement),v=o?u.getPropertyValue("--color-up").trim()||"#ef4444":u.getPropertyValue("--color-down").trim()||"#3b82f6",y=d.map((p,b)=>({x:c+b/(d.length-1)*(l-c*2),y:c+(1-(p-f)/g)*(r-c*2)})),h=n.createLinearGradient(0,0,0,r);h.addColorStop(0,o?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)"),h.addColorStop(1,"rgba(0,0,0,0)"),n.beginPath(),n.moveTo(y[0].x,y[0].y);for(let p=1;p<y.length;p++)n.lineTo(y[p].x,y[p].y);n.lineTo(y[y.length-1].x,r),n.lineTo(y[0].x,r),n.closePath(),n.fillStyle=h,n.fill(),n.beginPath(),n.moveTo(y[0].x,y[0].y);for(let p=1;p<y.length;p++)n.lineTo(y[p].x,y[p].y);n.strokeStyle=v,n.lineWidth=1.5,n.stroke()}let W=null,H=null;const se={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(99, 102, 241, 0.3)",borderWidth:1,padding:12,cornerRadius:8,titleFont:{size:13,weight:"600"},bodyFont:{size:12},callbacks:{label:function(t){return` ${t.parsed.y.toLocaleString()}`}}}},scales:{x:{grid:{color:"rgba(148, 163, 184, 0.06)",lineWidth:1},ticks:{color:"#64748b",font:{size:11},maxRotation:0,autoSkip:!0,maxTicksLimit:8}},y:{position:"right",grid:{color:"rgba(148, 163, 184, 0.06)",lineWidth:1},ticks:{color:"#64748b",font:{size:11},callback:function(t){return t.toLocaleString()}}}},interaction:{intersect:!1,mode:"index"},elements:{point:{radius:0,hoverRadius:5}}};function re(t,e,o="가격"){const a=document.getElementById(t);if(!a||(W&&(W.destroy(),W=null),!e||e.length===0))return;const n=a.getContext("2d"),s=e.map(i=>i.close||0),l=s[s.length-1]>=s[0],r=getComputedStyle(document.documentElement),c=l?r.getPropertyValue("--color-up").trim()||"#ef4444":r.getPropertyValue("--color-down").trim()||"#3b82f6",d=n.createLinearGradient(0,0,0,200);d.addColorStop(0,l?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)"),d.addColorStop(1,"rgba(0,0,0,0)");const f=e.map(i=>{const g=new Date(i.date);return`${g.getMonth()+1}/${g.getDate()}`});return W=new Chart(n,{type:"line",data:{labels:f,datasets:[{label:o,data:s,borderColor:c,backgroundColor:d,borderWidth:2,fill:!0,tension:.3}]},options:{...se}}),W}function le(t,e=[],o={}){const a=document.getElementById(t);if(!a||(H&&(H.destroy(),H=null),!e.length))return null;const n=a.getContext("2d"),{activeKey:s="all",onSliceClick:l}=o;return H=new Chart(n,{type:"doughnut",data:{labels:e.map(r=>r.label),datasets:[{data:e.map(r=>r.value),backgroundColor:e.map(r=>r.color||"#64748b"),borderColor:e.map(r=>s==="all"||r.key===s?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.02)"),borderWidth:e.map(r=>s==="all"||r.key===s?2:1),hoverOffset:8,offset:e.map(r=>s==="all"?0:r.key===s?14:0)}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"62%",onClick:(r,c)=>{if(!c.length||typeof l!="function")return;const d=c[0].index,f=e[d];f&&l(f.key)},plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#cbd5e1",borderColor:"rgba(99, 102, 241, 0.2)",borderWidth:1,callbacks:{label(r){const c=e.reduce((i,g)=>i+g.value,0)||1,d=r.parsed||0,f=d/c*100;return` ₩${Math.round(d).toLocaleString()} (${f.toFixed(1)}%)`}}}}}}),H}let U="all",rt="all",K="all",P="all",lt="all",V="",z="all",_=!0,T="all";const ft={all:[{id:"all",label:"전체"}],korean:[{id:"all",label:"전체"},{id:"kr_major",label:"🇰🇷 대표주"},{id:"kr_finance",label:"🏦 금융"},{id:"kr_battery",label:"🔋 2차전지"},{id:"kr_defense",label:"🛡️ 방산"},{id:"kr_bio",label:"🧬 바이오"},{id:"kr_it",label:"💻 IT/플랫폼"},{id:"kr_entertainment",label:"🎤 엔터"},{id:"kr_heavy",label:"🏗️ 중공업"},{id:"kr_consumer",label:"🛒 소비/유통"}],overseas:[{id:"all",label:"전체"},{id:"tech",label:"🖥️ 기술주"},{id:"semiconductor",label:"💾 반도체"},{id:"obesity_drug",label:"💉 비만 치료제/의약"},{id:"ai_data",label:"🤖 AI/데이터"},{id:"defense",label:"🛡️ 방산"},{id:"energy",label:"⚡ 에너지"},{id:"consumer",label:"🛒 소비재"},{id:"healthcare",label:"💊 헬스케어"},{id:"finance",label:"🏦 금융"},{id:"communication",label:"📡 통신/미디어"},{id:"industrial",label:"🏭 산업재"},{id:"commodity",label:"🥇 귀금속"},{id:"minerals",label:"⛏️ 원자재/광물"}],etf:[{id:"all",label:"전체"},{id:"etf_us",label:"🌎 해외 ETF"},{id:"etf_kr",label:"🇰🇷 국내 ETF"}],crypto:[{id:"all",label:"전체"},{id:"crypto",label:"🪙 주요 코인"}]},m={overseas:[],korean:[],gold:[],crypto:[],news:{updatedAt:null,categories:[],items:{}},custom:[],privateHistory:[],favorites:Q("favorites",[]),strategyMemo:Q("strategyMemo",{}).text||"",strategyMemoSavedAt:Q("strategyMemo",{}).savedAt||"",portfolio:At(Q("portfolio",[])),loading:!1};function Mt(){return`pf_${Date.now()}_${Math.random().toString(36).slice(2,8)}`}function ct(){const t=new Date,e=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${o}-${a}`}function At(t=[]){return t.map(e=>{var o;return{...e,id:e.id||Mt(),buyDate:e.buyDate||((o=e.addedAt)==null?void 0:o.slice(0,10))||""}})}async function _e(){ve(),$e(),Ie(),Ee(),ke(),we(),Ce(),Le(),Be(),Ae(),xe(),Te(),Ke(),be(),Nt(),await Y()}async function Y(){var t;m.loading=!0,Et(!0);try{const[e,o,a,n,s,l,r,c]=await Promise.all([_t().catch(()=>({data:[]})),qt().catch(()=>({data:[]})),Qt().catch(()=>({data:[]})),jt().catch(()=>({data:[]})),O().catch(()=>({data:[]})),Gt().catch(()=>({data:{updatedAt:null,categories:[],items:{}}})),Ot().catch(()=>({data:[]})),Lt().catch(()=>({data:null}))]);m.overseas=e.data||[],m.korean=o.data||[],m.gold=a.data||[],m.crypto=n.data||[],m.news=l.data||{updatedAt:null,categories:[],items:{}},m.custom=s.data||[],m.privateHistory=r.data||[],Ht((t=c.data)==null?void 0:t.usdKrw),I(),it(),Pe(),Fe()}catch(e){console.error("데이터 로드 실패:",e)}finally{m.loading=!1,Et(!1)}}async function it(){const t=D(),e=t.filter(g=>(g.dailyChangePercent??g.changePercent??0)>0).length,o=t.filter(g=>(g.dailyChangePercent??g.changePercent??0)<0).length,a=t.filter(g=>(g.dailyChangePercent??g.changePercent??0)===0).length,n=t.filter(g=>g.price>0).length,s=document.getElementById("totalCount"),l=document.getElementById("upCount"),r=document.getElementById("downCount"),c=document.getElementById("coverageCount"),d=document.getElementById("flatCountMeta"),f=document.getElementById("upBreakdown"),i=document.getElementById("downBreakdown");s&&(s.textContent=t.length),l&&(l.textContent=e),r&&(r.textContent=o),d&&(d.textContent=`보합 ${a}`),f&&(f.innerHTML=gt(t,"up")),i&&(i.innerHTML=gt(t,"down")),c&&(c.textContent=`${n}/${t.length}`,c.title=`종가 기준 ${n}개 종목 수집 완료`),Rt();try{const u=(await Yt()).data||[],v={"USD/KRW":{valueId:"usdKrwValue",changeId:"usdKrwChange",cardId:"cardUsdKrw"},US10Y:{valueId:"us10yValue",changeId:"us10yChange",cardId:"cardUs10Y"},US13W:{valueId:"us13wValue",changeId:"us13wChange",cardId:"cardUs13W"},DXY:{valueId:"dxyValue",changeId:"dxyChange",cardId:"cardDxy"},VIX:{valueId:"vixValue",changeId:"vixChange",cardId:"cardVix"},MVRV_Z:{valueId:"mvrvZValue",changeId:"mvrvZChange",cardId:"cardMvrvZ"}};u.forEach(y=>{const h=v[y.key];if(!h)return;const p=document.getElementById(h.valueId),b=document.getElementById(h.changeId),S=document.getElementById(h.cardId),E=typeof y.changePercent=="number",w=Number(y.changePercent)||0,M=typeof y.changeValue=="number",k=Number(y.changeValue)||0,L=E?w>=0:k>=0;if(p&&(p.textContent=ie(y)),b)if(E){const A=L?"▲":"▼";b.textContent=`${A} ${Math.abs(w).toFixed(2)}%`,b.className=`card-change ${L?"up":"down"}`}else if(M){const A=L?"▲":"▼";b.textContent=`${A} ${Math.abs(k).toFixed(2)}pt`,b.className=`card-change ${L?"up":"down"}`}else b.textContent="기준 환율",b.className="card-change neutral";S&&(S.classList.remove("up","down"),(E||M)&&S.classList.add(L?"up":"down"))})}catch(g){console.error("매크로 지표 로드 실패:",g)}try{const u=(await Zt()).data||[],v={"^GSPC":{priceId:"sp500Price",changeId:"sp500Change",cardId:"cardSP500",sparkId:"sparkline-GSPC"},"^NDX":{priceId:"nasdaqPrice",changeId:"nasdaqChange",cardId:"cardNASDAQ",sparkId:"sparkline-NDX"},"^KS11":{priceId:"kospiPrice",changeId:"kospiChange",cardId:"cardKOSPI",sparkId:"sparkline-KS11"},"^KQ11":{priceId:"kosdaqPrice",changeId:"kosdaqChange",cardId:"cardKOSDAQ",sparkId:"sparkline-KQ11"}};u.forEach(y=>{var M;const h=v[y.symbol];if(!h)return;const p=document.getElementById(h.priceId),b=document.getElementById(h.changeId),S=document.getElementById(h.cardId);p&&y.price!=null&&(p.textContent=y.price.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}));const E=y.changePercent||0,w=E>=0;if(b){const k=w?"▲":"▼";b.textContent=`${k} ${Math.abs(E).toFixed(2)}%`,b.className=`card-change ${w?"up":"down"}`}S&&(S.classList.remove("up","down"),S.classList.add(w?"up":"down")),h.sparkId&&((M=y.history)==null?void 0:M.length)>0&&setTimeout(()=>{Bt(h.sparkId,y.history,w)},100)})}catch(g){console.error("시장 지수 로드 실패:",g)}}function ce(t){const e=t.market||"",o=t.theme||"",a=t.symbol||"";return o==="crypto"||e==="crypto"?"crypto":["etf_us","etf_kr"].includes(o)||e==="etf"?"etf":e==="korean"||t.currency==="KRW"||a.endsWith(".KS")||a.endsWith(".KQ")?"korean":"overseas"}function gt(t,e){return[["korean","국내"],["overseas","해외"],["etf","ETF"],["crypto","코인"]].map(([a,n])=>{const s=t.filter(d=>ce(d)===a),l=s.filter(d=>{const f=Number(d.dailyChangePercent??d.changePercent??0);return e==="up"?f>0:f<0}).length,r=s.length,c=r>0?l/r*100:0;return`
                <div class="card-breakdown-item">
                    <span class="card-breakdown-label">${n}</span>
                    <span class="card-breakdown-count">${l}/${r}</span>
                    <span class="card-breakdown-dot">·</span>
                    <span class="card-breakdown-ratio">${c.toFixed(0)}%</span>
                </div>
            `}).join("")}function ie(t){if(t.value==null)return"-";switch(t.format){case"krw":return`₩${Number(t.value).toLocaleString("ko-KR",{minimumFractionDigits:0,maximumFractionDigits:0})}`;case"percent":return`${Number(t.value).toFixed(2)}%`;default:return Number(t.value).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}}function D(){return[...m.overseas,...m.korean,...m.gold,...m.crypto,...m.custom]}function I(){const t=document.getElementById("viewTitle"),e=document.getElementById("summaryCards"),o=document.getElementById("stocksSection"),a=document.getElementById("newsSection"),n=document.getElementById("chartSection"),s=document.getElementById("portfolioSection"),l=document.getElementById("historySection"),r=document.getElementById("strategySection"),c=document.getElementById("heatmapSection"),d=document.getElementById("marketFilterBar");switch(e&&(e.style.display="grid"),o.style.display="block",a&&(a.style.display="none"),n.style.display="none",s&&(s.style.display="none"),l&&(l.style.display="none"),r&&(r.style.display="none"),c&&(c.style.display="none"),U){case"all":t.textContent="대시보드",d.style.display="flex",vt(ht());break;case"news":t.textContent="🗞️ 시장 뉴스",e&&(e.style.display="none"),o.style.display="none",a&&(a.style.display="block"),d.style.display="none",xt();break;case"portfolio":t.textContent="💼 내 포트폴리오",e&&(e.style.display="none"),o.style.display="none",s&&(s.style.display="block"),d.style.display="none",R();break;case"history":t.textContent="🧾 히스토리",e&&(e.style.display="none"),o.style.display="none",d.style.display="none",l&&(l.style.display="block"),me();break;case"strategy":t.textContent="📝 투자 전략",e&&(e.style.display="none"),o.style.display="none",d.style.display="none",r&&(r.style.display="block"),Se();break;case"heatmap":t.textContent="🗺️ 히트맵",e&&(e.style.display="none"),o.style.display="none",d.style.display="none",c&&(c.style.display="block");break;default:U="all",t.textContent="대시보드",d.style.display="flex",vt(ht());break}}function ht(){let t=de(rt);if(K!=="all"&&(t=t.filter(e=>e.theme===K)),P!=="all"&&(t=t.filter(e=>{const o=e.dailyChangePercent??e.changePercent??0;switch(P){case"up":return o>0;case"down":return o<0;case"spike":return o>=5;case"crash":return o<=-5;default:return!0}})),lt==="favorites"&&(t=t.filter(e=>Z(e.symbol))),V){const e=V.toLowerCase();t=t.filter(o=>[o.name,o.symbol,o.korCode,o.themeName,o.theme].filter(Boolean).map(n=>String(n).toLowerCase()).some(n=>n.includes(e)))}return t}function de(t){switch(t){case"korean":return[...m.korean,...m.custom.filter(e=>e.market==="korean")];case"overseas":return[...m.overseas,...m.gold,...m.custom.filter(e=>!["korean","etf","crypto"].includes(e.market))];case"etf":return[...[...m.overseas,...m.korean].filter(e=>["etf_us","etf_kr"].includes(e.theme)),...m.custom.filter(e=>e.market==="etf")];case"crypto":return[...m.crypto,...m.custom.filter(e=>e.market==="crypto")];case"all":default:return D()}}function vt(t){const e=document.getElementById("stocksGrid");if(e.innerHTML="",!t.length){e.innerHTML=V?`<div class="stocks-empty">"${V}" 검색 결과가 없습니다.</div>`:`<div class="stocks-empty">데이터가 없습니다. '수집' 버튼을 클릭해주세요.</div>`;return}const o={},a=[];t.forEach(n=>{n.themeName?(o[n.themeName]||(o[n.themeName]=[]),o[n.themeName].push(n)):a.push(n)});for(const[n,s]of Object.entries(o)){const l=document.createElement("div");l.className="theme-section",l.innerHTML=`<div class="theme-header"><h3 class="theme-title">${n}</h3><span class="theme-count">${s.length}종목</span></div>`;const r=document.createElement("div");r.className="stocks-grid",s.forEach(c=>{const d=pt({...c,isFavorite:Z(c.symbol)},{onToggleFavorite:at});r.appendChild(d)}),l.appendChild(r),e.appendChild(l),setTimeout(()=>{s.forEach(c=>{const d=`sparkline-${c.symbol.replace(/[^a-zA-Z0-9]/g,"_")}`,f=c.dailyChangePercent??c.changePercent??0,i=c.history&&c.history.length>=2?c.history:ue(c.price);Bt(d,i,f>=0)})},100)}if(a.length>0){const n=document.createElement("div");n.className="stocks-grid",a.forEach(s=>{const l=pt({...s,isFavorite:Z(s.symbol)},{onToggleFavorite:at});n.appendChild(l)}),e.appendChild(n)}}function ue(t){const e=[];let o=t*(.97+Math.random()*.06);for(let a=0;a<20;a++)o+=o*.008*(Math.random()-.45),e.push({close:o});return e}function xt(){const t=document.getElementById("newsGrid"),e=document.getElementById("newsUpdatedAt");if(!t)return;const o=m.news||{},a=o.updatedAt,n=o.items||{};e&&(e.textContent=`뉴스 수집 시각: ${a?bt(a):"-"}`);const l=(z==="all"?Object.values(n).flat():n[z]||[]).filter(r=>(r==null?void 0:r.title)&&(r==null?void 0:r.link)).sort((r,c)=>new Date(c.publishedAt||0)-new Date(r.publishedAt||0));if(!l.length){t.innerHTML='<div class="stocks-empty">표시할 뉴스가 없습니다. 종가 수집 배치를 한 번 실행하면 채워집니다.</div>';return}t.innerHTML=l.map(r=>`
        <article class="news-card">
            <div class="news-card-top">
                <span class="news-badge">${r.categoryName||r.category}</span>
                <span class="news-time">${r.publishedAt?bt(r.publishedAt):"시간 정보 없음"}</span>
            </div>
            <a class="news-title" href="${r.link}" target="_blank" rel="noopener noreferrer">${r.title}</a>
            <p class="news-summary">${r.summary||r.title}</p>
            <div class="news-card-bottom">
                <span class="news-source">${r.source||"출처 미상"}</span>
                <a class="news-link" href="${r.link}" target="_blank" rel="noopener noreferrer">원문 보기</a>
            </div>
        </article>
    `).join("")}function me(){const t=document.getElementById("historyContent");if(!t)return;const e=m.privateHistory||[];if(!e.length){t.innerHTML='<div class="history-empty">등록된 히스토리가 없습니다.</div>';return}const o=ye(e);t.innerHTML=`
        <section class="history-overview-card">
            <div class="history-overview-header">
                <div>
                    <h2>전체 요약</h2>
                    <p>비상장과 해외주식 히스토리를 한 번에 정리한 누적 기준입니다.</p>
                </div>
                <div class="history-overview-badge">평가 가능 자산 기준 손익 포함</div>
            </div>
            <div class="history-overview-grid">
                <div class="history-overview-metric">
                    <span class="history-overview-label">총 순투입금액</span>
                    <strong>${$(o.totalNetInvested)}</strong>
                    <span class="history-overview-sub">비상장 + 해외주식 합산</span>
                </div>
                <div class="history-overview-metric">
                    <span class="history-overview-label">현재 확인 자산</span>
                    <strong>${$(o.totalKnownValue)}</strong>
                    <span class="history-overview-sub">최신 잔고/보유 메모 반영</span>
                </div>
                <div class="history-overview-metric ${o.totalKnownPnL>=0?"up":"down"}">
                    <span class="history-overview-label">누적 손익</span>
                    <strong>${o.totalKnownPnL>=0?"▲ ":"▼ "}${$(Math.abs(o.totalKnownPnL))}</strong>
                    <span class="history-overview-sub">${o.valuedAssetCount}개 자산 평가 기준</span>
                </div>
                <div class="history-overview-metric muted">
                    <span class="history-overview-label">미평가 자산</span>
                    <strong>${$(o.unvaluedNetInvested)}</strong>
                    <span class="history-overview-sub">${o.unvaluedNames.join(", ")||"없음"}</span>
                </div>
            </div>
        </section>
        ${e.map(a=>{var d,f,i,g;const n=a.historyType==="cashflow",s=n?Ft(a.transactions):Pt(a.transactions),l=(a.holdings||[]).reduce((u,v)=>u+v.value,0),r=Tt(a),c=typeof r=="number"?r-Kt(a):null;return`
            <article class="history-asset-card">
                <div class="history-asset-header">
                    <div>
                        <div class="history-asset-title-row">
                            <h2>${a.name}</h2>
                            <span class="history-asset-badge">${a.market}</span>
                        </div>
                        <p class="history-asset-note">${a.note}</p>
                    </div>
                    <div class="history-asset-holding">
                        <span class="history-asset-holding-label">${n?"현재 확인 자산":"잔여 수량"}</span>
                        <strong>${n?$(r||0):`${s.remainingShares.toLocaleString()}주`}</strong>
                    </div>
                </div>

                <div class="history-summary-grid">
                    ${n?`
                        <div class="history-summary-card buy">
                            <span class="history-summary-label">총 입금액</span>
                            <strong>${$(s.depositAmount)}</strong>
                            <span class="history-summary-sub">${s.depositCount}건</span>
                        </div>
                        <div class="history-summary-card sell">
                            <span class="history-summary-label">총 출금액</span>
                            <strong>${$(s.withdrawalAmount)}</strong>
                            <span class="history-summary-sub">${s.withdrawalCount}건</span>
                        </div>
                    `:`
                        <div class="history-summary-card buy">
                            <span class="history-summary-label">총 매수</span>
                            <strong>${$(s.buyAmount)}</strong>
                            <span class="history-summary-sub">${s.buyShares.toLocaleString()}주 · 평균 ${$(s.buyAvgPrice,!1)}/주</span>
                        </div>
                        <div class="history-summary-card sell">
                            <span class="history-summary-label">총 매도</span>
                            <strong>${$(s.sellAmount)}</strong>
                            <span class="history-summary-sub">${s.sellShares.toLocaleString()}주 · 평균 ${$(s.sellAvgPrice,!1)}/주</span>
                        </div>
                    `}
                    <div class="history-summary-card neutral">
                        <span class="history-summary-label">${n?"차액":"순투입금액"}</span>
                        <strong>${$(n?s.netAmount:s.netInvested)}</strong>
                        <span class="history-summary-sub">${n?"입금 - 출금 기준":"매수 - 매도 기준"}</span>
                    </div>
                    <div class="history-summary-card neutral">
                        <span class="history-summary-label">거래 건수</span>
                        <strong>${s.tradeCount}건</strong>
                        <span class="history-summary-sub">최초 ${j(s.firstDate)} · 마지막 ${j(s.lastDate)}</span>
                    </div>
                    <div class="history-summary-card ${c==null?"muted":c>=0?"buy":"sell"}">
                        <span class="history-summary-label">누적 손익</span>
                        <strong>${c==null?"미평가":`${c>=0?"▲ ":"▼ "}${$(Math.abs(c))}`}</strong>
                        <span class="history-summary-sub">${c==null?"현재 평가 정보가 없어 계산 보류":"현재 확인 자산 - 순투입금액"}</span>
                    </div>
                </div>

                ${(d=a.balanceSnapshots)!=null&&d.length||(f=a.holdings)!=null&&f.length?`
                    <div class="history-side-grid">
                        ${(i=a.balanceSnapshots)!=null&&i.length?`
                            <div class="history-side-card">
                                <h3>잔고 메모</h3>
                                <div class="history-side-list">
                                    ${a.balanceSnapshots.map(u=>`
                                        <div class="history-side-row">
                                            <span>${u.label} ${j(u.date)}</span>
                                            <strong>${$(u.value)}</strong>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        `:""}
                        ${(g=a.holdings)!=null&&g.length?`
                            <div class="history-side-card">
                                <h3>보유 메모</h3>
                                <div class="history-side-list">
                                    ${a.holdings.map(u=>`
                                        <div class="history-side-row">
                                            <span>${u.label}</span>
                                            <strong>${$(u.value)}</strong>
                                        </div>
                                    `).join("")}
                                    <div class="history-side-row total">
                                        <span>합계</span>
                                        <strong>${$(l)}</strong>
                                    </div>
                                </div>
                            </div>
                        `:""}
                    </div>
                `:""}

                <div class="history-table">
                    <div class="history-table-header">
                        <span>날짜</span>
                        <span>구분</span>
                        <span>${n?"금액":"수량"}</span>
                        <span>${n?"누적 잔고":"단가"}</span>
                        <span>${n?"비고":"금액"}</span>
                    </div>
                    ${a.transactions.slice().sort((u,v)=>new Date(u.date)-new Date(v.date)).map(u=>`
                            <div class="history-table-row ${u.type}">
                                <span>${j(u.date)}</span>
                                <span class="history-trade-type ${u.type}">${fe(u.type)}</span>
                                <span>${n?$(u.amount):`${u.shares.toLocaleString()}주`}</span>
                                <span>${n?$(u.balance):$(u.price,!1)}</span>
                                <span>${n?ge(u):$(u.amount)}</span>
                            </div>
                        `).join("")}
                </div>
            </article>
        `}).join("")}`}function Pt(t){var r,c;const e=t.filter(d=>d.type==="buy"),o=t.filter(d=>d.type==="sell"),a=e.reduce((d,f)=>d+f.amount,0),n=o.reduce((d,f)=>d+f.amount,0),s=e.reduce((d,f)=>d+f.shares,0),l=o.reduce((d,f)=>d+f.shares,0);return{buyAmount:a,sellAmount:n,buyShares:s,sellShares:l,buyAvgPrice:s>0?a/s:0,sellAvgPrice:l>0?n/l:0,remainingShares:s-l,netInvested:a-n,tradeCount:t.length,firstDate:(r=t[0])==null?void 0:r.date,lastDate:(c=t[t.length-1])==null?void 0:c.date}}function Ft(t){var s,l;const e=t.filter(r=>r.type==="deposit"),o=t.filter(r=>r.type==="withdrawal"),a=e.reduce((r,c)=>r+c.amount,0),n=o.reduce((r,c)=>r+c.amount,0);return{depositAmount:a,withdrawalAmount:n,depositCount:e.length,withdrawalCount:o.length,netAmount:a-n,tradeCount:t.length,firstDate:(s=t[0])==null?void 0:s.date,lastDate:(l=t[t.length-1])==null?void 0:l.date}}function ye(t){const e=t.map(o=>{const a=Kt(o),n=Tt(o),s=typeof n=="number";return{name:o.name,netInvested:a,currentValue:n,hasCurrentValue:s,pnl:s?n-a:null}});return{totalNetInvested:e.reduce((o,a)=>o+a.netInvested,0),totalKnownValue:e.filter(o=>o.hasCurrentValue).reduce((o,a)=>o+a.currentValue,0),totalKnownPnL:e.filter(o=>o.hasCurrentValue).reduce((o,a)=>o+a.pnl,0),unvaluedNetInvested:e.filter(o=>!o.hasCurrentValue).reduce((o,a)=>o+a.netInvested,0),valuedAssetCount:e.filter(o=>o.hasCurrentValue).length,unvaluedNames:e.filter(o=>!o.hasCurrentValue).map(o=>o.name)}}function Kt(t){return t.historyType==="cashflow"?Ft(t.transactions).netAmount:Pt(t.transactions).netInvested}function Tt(t){if(t.historyType!=="cashflow")return null;const e=pe(t.balanceSnapshots||[]),o=(t.holdings||[]).reduce((a,n)=>a+n.value,0);return((e==null?void 0:e.value)||0)+o}function pe(t=[]){return t.slice().sort((e,o)=>new Date(o.date)-new Date(e.date))[0]||null}function $(t,e=!0){const o=Math.round(t||0).toLocaleString("ko-KR");return e?`₩${o}`:`${o}원`}function j(t){const e=new Date(t);return Number.isNaN(e.getTime())?"-":e.toLocaleDateString("ko-KR",{year:"2-digit",month:"2-digit",day:"2-digit"})}function fe(t){return{buy:"매수",sell:"매도",deposit:"입금",withdrawal:"출금"}[t]||t}function ge(t){return t.type==="deposit"?"계좌 입금":"계좌 출금"}function he(t){var e,o,a,n;return t!=null&&t.externalUrl?t.externalUrl:t!=null&&t.korCode?`https://finance.naver.com/item/main.naver?code=${t.korCode}`:(e=t==null?void 0:t.symbol)!=null&&e.endsWith(".KS")||(o=t==null?void 0:t.symbol)!=null&&o.endsWith(".KQ")?`https://finance.naver.com/item/main.naver?code=${t.symbol.replace(".KS","").replace(".KQ","")}`:(a=t==null?void 0:t.symbol)!=null&&a.includes("-USD")||(n=t==null?void 0:t.symbol)!=null&&n.includes("=F")?`https://www.google.com/finance/quote/${encodeURIComponent(t.symbol)}`:""}function bt(t){const e=new Date(t);return Number.isNaN(e.getTime())?"-":e.toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function ve(){document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",()=>{U=t.dataset.view,document.querySelectorAll(".nav-item").forEach(e=>e.classList.remove("active")),t.classList.add("active"),I()})})}function be(){const t=document.getElementById("strategyMemoInput"),e=document.getElementById("strategyClearBtn");t&&(t.value=m.strategyMemo||"",t.addEventListener("input",()=>{m.strategyMemo=t.value,m.strategyMemoSavedAt=new Date().toISOString(),St(),nt()})),e&&e.addEventListener("click",()=>{m.strategyMemo="",m.strategyMemoSavedAt=new Date().toISOString(),St(),t&&(t.value=""),nt()})}function St(){st("strategyMemo",{text:m.strategyMemo,savedAt:m.strategyMemoSavedAt})}function Se(){const t=document.getElementById("strategyMemoInput");t&&t.value!==m.strategyMemo&&(t.value=m.strategyMemo||""),nt()}function nt(){const t=document.getElementById("strategySavedAt");if(!t)return;if(!m.strategyMemoSavedAt){t.textContent="저장 기록 없음";return}const e=new Date(m.strategyMemoSavedAt);if(Number.isNaN(e.getTime())){t.textContent="방금 저장됨";return}t.textContent=`자동 저장: ${e.toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function $e(){document.querySelectorAll(".filter-tab").forEach(t=>{t.addEventListener("click",()=>{rt=t.dataset.filter,document.querySelectorAll(".filter-tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),K="all",Nt(),I()})})}function Ee(){document.querySelectorAll(".movement-chip").forEach(t=>{t.addEventListener("click",()=>{P=t.dataset.movement,Dt(),I()})})}function ke(){document.querySelectorAll(".favorite-chip").forEach(t=>{t.addEventListener("click",()=>{lt=t.dataset.favoriteFilter||"all",$t(),I()})}),$t()}function we(){Object.entries({cardTotal:"all",cardUp:"up",cardDown:"down"}).forEach(([e,o])=>{const a=document.getElementById(e);a&&(a.classList.add("summary-card-filter"),a.addEventListener("click",()=>{P=o,Dt(),I()}))})}function Ce(){const t=document.getElementById("summaryBreakdownTooltip");if(!t)return;const e=document.querySelectorAll("[data-breakdown-source]"),o=()=>{t.classList.remove("active"),t.setAttribute("aria-hidden","true")},a=n=>{const l=t.offsetWidth||240,r=t.offsetHeight||120,c=Math.min(n.clientX+18,window.innerWidth-l-12),d=Math.min(n.clientY+18,window.innerHeight-r-12);t.style.left=`${Math.max(12,c)}px`,t.style.top=`${Math.max(12,d)}px`};e.forEach(n=>{const s=n.dataset.breakdownSource,l=document.getElementById(s);l&&(n.addEventListener("mouseenter",r=>{l.innerHTML.trim()&&(t.innerHTML=l.innerHTML,t.classList.add("active"),t.setAttribute("aria-hidden","false"),a(r))}),n.addEventListener("mousemove",r=>{t.classList.contains("active")&&a(r)}),n.addEventListener("mouseleave",o))})}function Dt(){document.querySelectorAll(".movement-chip").forEach(t=>{t.classList.toggle("active",t.dataset.movement===P)}),Rt()}function $t(){document.querySelectorAll(".favorite-chip").forEach(t=>{t.classList.toggle("active",t.dataset.favoriteFilter===lt)})}function Rt(){Object.entries({cardTotal:P==="all",cardUp:P==="up",cardDown:P==="down"}).forEach(([e,o])=>{const a=document.getElementById(e);a&&a.classList.toggle("active-filter",o)})}function Ie(){const t=document.getElementById("categoryFilters");t&&t.addEventListener("click",e=>{const o=e.target.closest(".category-chip");o&&(K=o.dataset.category,Me(),I())})}function Le(){const t=document.getElementById("stockSearchInput");t&&t.addEventListener("input",e=>{V=e.target.value.trim(),I()})}function Be(){document.querySelectorAll(".news-tab").forEach(t=>{t.addEventListener("click",()=>{z=t.dataset.newsFilter||"all",document.querySelectorAll(".news-tab").forEach(e=>{e.classList.toggle("active",e.dataset.newsFilter===z)}),U==="news"&&xt()})})}function Nt(){var a;const t=document.getElementById("categoryFilters");if(!t)return;const e=ft[rt]||ft.all,o=((a=t.querySelector(".filter-group-label"))==null?void 0:a.outerHTML)||'<span class="filter-group-label">카테고리</span>';t.innerHTML=`${o}${e.map(n=>`
        <button class="category-chip${n.id===K?" active":""}" data-category="${n.id}">
            ${n.label}
        </button>
    `).join("")}`}function Me(){document.querySelectorAll(".category-chip").forEach(t=>{t.classList.toggle("active",t.dataset.category===K)})}function Ae(){const t=document.getElementById("stockModal"),e=t==null?void 0:t.querySelector(".modal-close");e&&e.addEventListener("click",()=>t.classList.remove("active")),t==null||t.addEventListener("click",o=>{o.target===t&&t.classList.remove("active")}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(t!=null&&t.classList.contains("active"))&&t.classList.remove("active")})}document.addEventListener("click",t=>{const e=t.target.closest(".stock-favorite-btn");if(e){t.preventDefault(),t.stopPropagation(),at(e.dataset.favoriteSymbol);return}const o=t.target.closest(".stock-chart-link");if(!o)return;const a=o.dataset.chartSymbol,n=D().find(l=>l.symbol===a);if(!n)return;const s=he(n);if(s){window.open(s,"_blank","noopener,noreferrer");return}Wt(n)});function Z(t){return m.favorites.includes(t)}function at(t){t&&(Z(t)?m.favorites=m.favorites.filter(e=>e!==t):m.favorites=[...m.favorites,t],st("favorites",m.favorites),I())}async function Wt(t){var g,u,v,y,h;const e=document.getElementById("stockModal");t.symbol.includes(".KS")||t.symbol.includes(".KQ");const o=t.symbol.replace(".KS","").replace(".KQ",""),a=`${t.name} (${o})`,n=t.currency==="KRW"?"₩":"$",s=t.dailyChangePercent??t.changePercent??0,l=t.monthlyChangePercent??null,r=s===0?"neutral":s>0?"up":"down",c=s===0?"":s>0?"▲":"▼";document.getElementById("modalTitle").textContent=a,document.getElementById("modalPrice").textContent=`${n}${(g=t.price)==null?void 0:g.toLocaleString()}`,document.getElementById("modalPrice").className=`modal-price ${r}`;const d=document.getElementById("modalChangeBadge");d&&(d.textContent=`${c?`${c} `:""}${Math.abs(s).toFixed(2)}%`,d.className=`modal-change-badge ${r}`),document.getElementById("modalChange").innerHTML=`${c?`${c} `:""}${Math.abs(s).toFixed(2)}%`,document.getElementById("modalPrevClose").textContent=t.previousClose?`${n}${(u=t.previousClose)==null?void 0:u.toLocaleString()}`:"-";const f=document.getElementById("modalPrevDate");if(f){const p=new Date,b=new Date(p),S=p.getDay();S===1?b.setDate(p.getDate()-3):S===0?b.setDate(p.getDate()-2):b.setDate(p.getDate()-1);const E=b.getMonth()+1,w=b.getDate();f.textContent=`(${E}/${w})`}document.getElementById("modalHigh52").textContent=`${n}${((v=t.high52)==null?void 0:v.toLocaleString())||"0"}`,document.getElementById("modalLow52").textContent=`${n}${((y=t.low52)==null?void 0:y.toLocaleString())||"0"}`;const i=document.getElementById("modalMonthly");i&&l!==null&&(i.textContent=`${l>=0?"▲":"▼"} ${Math.abs(l).toFixed(2)}%`,i.className=`modal-metric-value ${l>=0?"up":"down"}`),e.classList.add("active");try{const p=await ee(t.symbol);(h=p.data)!=null&&h.length&&re("modalChart",p.data,t.name)}catch{console.warn("차트 로드 실패")}}function xe(){var o,a;(o=document.getElementById("btnRefresh"))==null||o.addEventListener("click",async()=>{const n=document.getElementById("btnRefresh");n.classList.add("spinning"),ne(),await Y(),n.classList.remove("spinning")}),(a=document.getElementById("btnCollect"))==null||a.addEventListener("click",async()=>{const n=document.getElementById("btnCollect");n.disabled=!0,n.textContent="⏳ 수집 중...";try{await zt(),await Y()}catch(s){console.error("수집 실패:",s),alert(s.message||"수집에 실패했습니다.")}finally{n.disabled=!1,n.textContent="↓ 수집"}});const t=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",t);const e=document.getElementById("btnThemeToggle");e&&(e.textContent=t==="dark"?"☀️":"🌙",e.addEventListener("click",()=>{const s=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("theme",s),e.textContent=s==="dark"?"☀️":"🌙"}))}function Pe(){const t=document.getElementById("lastUpdate");t&&(t.textContent=`마지막 새로고침: ${new Date().toLocaleTimeString("ko-KR")}`)}async function Fe(){var e;const t=document.getElementById("dataDate");if(t)try{const o=await Xt();if((e=o.data)!=null&&e.lastCollectedAt){const a=new Date(o.data.lastCollectedAt),n=a.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit"}),s=a.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});t.textContent=`📅 데이터 기준: ${n} ${s}`,t.title=`마지막 데이터 수집: ${a.toLocaleString("ko-KR")}`}else t.textContent="📅 데이터 수집 대기 중..."}catch{t.textContent="📅 수집 정보 없음"}}function Et(t){const e=document.getElementById("loadingSpinner");e&&(e.style.display=t?"block":"none")}async function qe(){await Y()}function Ke(){var s;const t=document.getElementById("btnAddCustomStock"),e=document.getElementById("addStockModal"),o=document.getElementById("addStockModalClose"),a=document.getElementById("btnSubmitCustom"),n=document.getElementById("btnCancelCustom");t==null||t.addEventListener("click",()=>{var l;e.classList.add("active"),dt(),(l=document.getElementById("customSymbol"))==null||l.focus()}),o==null||o.addEventListener("click",()=>e.classList.remove("active")),n==null||n.addEventListener("click",()=>e.classList.remove("active")),e==null||e.addEventListener("click",l=>{l.target===e&&e.classList.remove("active")}),document.addEventListener("keydown",l=>{l.key==="Escape"&&(e!=null&&e.classList.contains("active"))&&e.classList.remove("active")}),a==null||a.addEventListener("click",kt),(s=document.getElementById("customSymbol"))==null||s.addEventListener("keydown",l=>{l.key==="Enter"&&kt()})}async function kt(){const t=document.getElementById("customSymbol"),e=document.getElementById("customName"),o=document.getElementById("customMarket"),a=document.getElementById("customStockMessage"),n=document.getElementById("btnSubmitCustom"),s=t==null?void 0:t.value.trim(),l=e==null?void 0:e.value.trim(),r=o==null?void 0:o.value;if(!s){G(a,"심볼을 입력해주세요.","error"),t==null||t.focus();return}n.disabled=!0,n.textContent="추가 중...";try{const c=await te(s,l,r);c.success?(G(a,`✅ ${c.data.name} (${c.data.symbol}) 추가 완료!`,"success"),t.value="",e.value="",dt(),setTimeout(async()=>{const d=await O().catch(()=>({data:[]}));m.custom=d.data||[],I(),it()},500)):G(a,`❌ ${c.error||"추가 실패"}`,"error")}catch(c){G(a,`❌ ${c.message||"서버 오류"}`,"error")}finally{n.disabled=!1,n.textContent="추가하기"}}function G(t,e,o){t&&(t.textContent=e,t.className=`form-message ${o}`,setTimeout(()=>{t.className="form-message",t.textContent=""},4e3))}async function dt(){const t=document.getElementById("customStocksList");if(t)try{const o=(await O()).data||[];if(o.length===0){t.innerHTML='<p class="custom-empty">아직 추가한 종목이 없습니다.</p>';return}t.innerHTML=o.map(a=>{var n;return`
            <div class="custom-stock-item">
                <div class="custom-stock-info">
                    <span class="custom-stock-symbol">${a.symbol}</span>
                    <span class="custom-stock-name">${a.name||a.symbol} · ${a.currency==="KRW"?"₩":"$"}${((n=a.price)==null?void 0:n.toLocaleString())||"-"}</span>
                </div>
                <button class="btn-remove-custom" data-symbol="${a.symbol}">삭제</button>
            </div>
        `}).join(""),t.querySelectorAll(".btn-remove-custom").forEach(a=>{a.addEventListener("click",async()=>{const n=a.dataset.symbol;if(confirm(`${n} 종목을 삭제하시겠습니까?`))try{await Jt(n),dt();const s=await O().catch(()=>({data:[]}));m.custom=s.data||[],I(),it()}catch(s){alert("삭제 실패: "+s.message)}})})}catch{t.innerHTML='<p class="custom-empty">목록 로드 실패</p>'}}let C=1350,B=null;function Te(){const t=document.getElementById("btnConfirmAdd"),e=document.getElementById("btnCancelAdd"),o=document.getElementById("btnOpenPortfolioAdd"),a=document.querySelectorAll("[data-cash-toggle]"),n=document.getElementById("portfolioAddForm"),s=document.getElementById("addStockSelect");o==null||o.addEventListener("click",()=>{B=null,X(),Ut(),n.style.display=n.style.display==="block"?"none":"block",n.style.display==="block"&&n.scrollIntoView({behavior:"smooth",block:"center"})}),e==null||e.addEventListener("click",()=>{n.style.display="none",B=null,X()}),t==null||t.addEventListener("click",()=>Re()),a.forEach(l=>{l.addEventListener("click",()=>{const r=l.dataset.cashToggle==="include";_!==r&&(_=r,Ct(),R())})}),Ct(),s==null||s.addEventListener("change",()=>{const l=s.value;if(!l)return;const[r,c]=l.split("|");if(r==="USD-CASH"||c==="cash_usd"){document.getElementById("addStockInput").value="USD",document.getElementById("addStockName").value="달러 현금",document.getElementById("addStockBuyPrice").value=C?Math.round(C):"",document.getElementById("addStockMarket").value="cash_usd";return}const f=D().find(i=>i.symbol===r);f&&(document.getElementById("addStockInput").value=f.symbol,document.getElementById("addStockName").value=f.name,document.getElementById("addStockBuyPrice").value=f.price||"",document.getElementById("addStockMarket").value=f.currency==="KRW"?"korean":"overseas")}),De()}async function De(){var t;try{const e=await Lt();Ht((t=e.data)==null?void 0:t.usdKrw)}catch{}}function Ht(t){if(!t)return;C=t;const e=document.getElementById("pfExchangeRate");e&&(e.textContent=`₩${Math.round(C).toLocaleString()}`),U==="portfolio"&&R()}function Ut(){const t=document.getElementById("addStockSelect");if(!t)return;const e=D();t.innerHTML='<option value="">-- 기존 종목에서 선택 --</option>';const o=document.createElement("option");o.value="USD-CASH|cash_usd",o.textContent=`달러 현금 (USD) - ₩${Math.round(C).toLocaleString()}`,t.appendChild(o),e.forEach(a=>{var l;const n=document.createElement("option");n.value=`${a.symbol}|${a.currency==="KRW"?"korean":"overseas"}`;const s=a.currency==="KRW"?"₩":"$";n.textContent=`${a.name} (${a.symbol}) - ${s}${(l=a.price)==null?void 0:l.toLocaleString()}`,t.appendChild(n)})}function X(){["addStockInput","addStockName","addStockBuyPrice"].forEach(r=>{const c=document.getElementById(r);c&&(c.value="")});const e=document.getElementById("addStockQty");e&&(e.value="1");const o=document.getElementById("addStockBuyDate");o&&(o.value=ct());const a=document.getElementById("addStockSelect");a&&(a.value="");const n=document.getElementById("addStockMarket");n&&(n.value="overseas");const s=document.getElementById("addStockInput");s&&(s.disabled=!1);const l=document.getElementById("addStockSelect");l&&(l.disabled=!1)}async function Re(){const t=document.getElementById("addStockInput"),e=document.getElementById("addStockName"),o=document.getElementById("addStockQty"),a=document.getElementById("addStockBuyPrice"),n=document.getElementById("addStockBuyDate"),s=document.getElementById("addStockMarket"),l=document.getElementById("portfolioAddForm"),c=((t==null?void 0:t.value.trim())||"").toUpperCase();e!=null&&e.value.trim();const d=parseFloat(o==null?void 0:o.value)||1,f=parseFloat(a==null?void 0:a.value)||0,i=(n==null?void 0:n.value)||ct(),u=["USD","USD-CASH","달러","달러현금"].includes(c)?"cash_usd":(s==null?void 0:s.value)||"overseas",v=u==="cash_usd";if(!c&&!v){t==null||t.focus();return}const y=v?"USD-CASH":c,h=v?(e==null?void 0:e.value.trim())||"달러 현금":(e==null?void 0:e.value.trim())||c,p={id:B||Mt(),symbol:y,name:h,market:u,qty:d,buyPrice:f,buyDate:i,currency:u==="korean"?"KRW":"USD",addedAt:new Date().toISOString()};B?m.portfolio=m.portfolio.map(b=>b.id===B?{...b,...p,editedAt:new Date().toISOString()}:b):m.portfolio.push(p),Vt(),l.style.display="none",B=null,X(),R()}function Ne(t){var f;const e=m.portfolio.find(i=>i.id===t),o=document.getElementById("portfolioAddForm");if(!e||!o)return;B=t,Ut();const a=document.getElementById("addStockInput"),n=document.getElementById("addStockName"),s=document.getElementById("addStockQty"),l=document.getElementById("addStockBuyPrice"),r=document.getElementById("addStockBuyDate"),c=document.getElementById("addStockMarket"),d=document.getElementById("addStockSelect");a&&(a.value=e.symbol==="USD-CASH"?"USD":e.symbol,a.disabled=!0),n&&(n.value=e.name||""),s&&(s.value=e.qty??1),l&&(l.value=e.buyPrice??""),r&&(r.value=e.buyDate||((f=e.addedAt)==null?void 0:f.slice(0,10))||ct()),c&&(c.value=e.market||"overseas"),d&&(d.value="",d.disabled=!0),o.style.display="block",o.scrollIntoView({behavior:"smooth",block:"center"})}function We(t){m.portfolio=m.portfolio.filter(e=>e.id!==t),B===t&&(B=null,X()),Vt(),R()}function Vt(){st("portfolio",At(m.portfolio))}function R(){const t=document.getElementById("portfolioStocks");if(!t)return;if(m.portfolio.length===0){t.innerHTML=`
            <div class="portfolio-empty">
                <span class="portfolio-empty-icon">📂</span>
                <p>포트폴리오가 비어 있습니다.</p>
            </div>`,tt([]),et(0,0);return}t.innerHTML="";const e=D();let o=0,a=0;const n=[],s=document.createElement("section");s.className="pf-holdings-section",s.innerHTML=`
        <div class="pf-section-header">
            <h3>종목별 합산</h3>
            <span>총 수량 · 평단가 · 손익</span>
        </div>
    `;const l=document.createElement("div");l.className="pf-summary-table",l.innerHTML=`
        <div class="pf-summary-table-header">
            <span class="pf-col-name">종목</span>
            <span class="pf-col-price">현재가</span>
            <span class="pf-col-qty">총 수량</span>
            <span class="pf-col-buy">평단가</span>
            <span class="pf-col-gain">증감</span>
        </div>`;const r=document.createElement("section");r.className="pf-holdings-section",r.innerHTML=`
        <div class="pf-section-header">
            <h3>히스토리</h3>
            <span>개별 매수 내역</span>
        </div>
    `;const c=document.createElement("div");c.className="pf-table",c.innerHTML=`
        <div class="pf-table-header">
            <span class="pf-col-name">종목</span>
            <span class="pf-col-price">현재가</span>
            <span class="pf-col-qty">수량</span>
            <span class="pf-col-eval">평가금 (KRW)</span>
            <span class="pf-col-buy">매입가</span>
            <span class="pf-col-gain">손익</span>
            <span class="pf-col-action"></span>
        </div>`;const d=m.portfolio.filter(i=>{const g=ot(i,e);return Ue(g)});if(!d.length){t.innerHTML=`
            <div class="portfolio-empty">
                <span class="portfolio-empty-icon">🧩</span>
                <p>선택한 구성 비율에 해당하는 종목이 없습니다.</p>
            </div>`,tt(wt(e)),et(o,a);return}const f=new Map;d.forEach(i=>{const g=ot(i,e),{qty:u,buyPrice:v,isUsdCash:y,isKRW:h,currentPrice:p,evalTotalKRW:b,investedKRW:S,gainKRW:E,gainPct:w,includeInSummary:M,liveData:k}=g,L=h?"₩":"$",A=`${i.symbol}__${i.market||""}`,ut=u>0?b/u:0,F=y?0:k?k.dailyChangePercent??k.changePercent??0:0,q=F===0?"neutral":F>0?"up":"down",mt=F===0?"":F>0?"▲":"▼";M&&(o+=b,a+=S);const J=E>=0?"up":"down",yt=E>=0?"▲":"▼",N=document.createElement("div");N.className=`pf-table-row ${q}`,N.dataset.portfolioId=i.id,N.dataset.symbol=i.symbol,N.innerHTML=`
            <div class="pf-col-name">
                <div class="pf-stock-info">
                    <span class="pf-stock-name">${i.name||(k==null?void 0:k.name)||i.symbol}</span>
                    <span class="pf-stock-symbol">${y?"USD 현금":i.symbol.replace(".KS","").replace(".KQ","")}</span>
                </div>
            </div>
            <div class="pf-col-price">
                <span class="pf-current-price">${y?`₩${Math.round(C).toLocaleString()}`:p?`${L}${p.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:"-"}</span>
                <span class="pf-daily-change ${q}">${y?"환율 기준 평가":`${mt?`${mt} `:""}${Math.abs(F).toFixed(2)}%`}</span>
            </div>
            <div class="pf-col-qty">${u.toLocaleString()}</div>
            <div class="pf-col-eval">
                <span class="pf-eval-krw">₩${Math.round(b).toLocaleString()}</span>
                ${h?"":`<span class="pf-eval-usd">$${(y?u:p*u).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>`}
            </div>
            <div class="pf-col-buy">
                ${v>0?`${y?"₩":L}${v.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:'<span class="pf-no-data">-</span>'}
                ${i.buyDate?`<span class="pf-buy-date">${i.buyDate}</span>`:""}
            </div>
            <div class="pf-col-gain ${J}">
                ${v>0?`
                    <span class="pf-gain-amount ${J}">${yt} ₩${Math.abs(Math.round(E)).toLocaleString()}</span>
                    <span class="pf-gain-pct ${J}">${yt} ${Math.abs(w).toFixed(2)}%</span>
                `:'<span class="pf-no-data">-</span>'}
            </div>
            <div class="pf-col-action">
                <button class="btn-edit-stock" data-portfolio-id="${i.id}" title="수정">수정</button>
                <button class="btn-remove-stock" data-portfolio-id="${i.id}" data-symbol="${i.symbol}" title="삭제">×</button>
            </div>
        `,c.appendChild(N),f.has(A)||f.set(A,{key:A,symbol:i.symbol,name:i.name||(k==null?void 0:k.name)||i.symbol,market:i.market,isUsdCash:y,isKRW:h,currencySymbol:L,currentPrice:p,currentUnitValueKRW:ut,totalQty:0,totalEvalKRW:0,totalInvestedKRW:0,totalBuyValue:0,dailyPct:F,dailyDirection:q});const x=f.get(A);x.totalQty+=u,x.totalEvalKRW+=b,x.totalInvestedKRW+=S,x.totalBuyValue+=v*u,x.currentPrice=p,x.currentUnitValueKRW=ut,x.dailyPct=F,x.dailyDirection=q}),f.forEach(i=>n.push(i)),n.sort((i,g)=>g.totalEvalKRW-i.totalEvalKRW).forEach(i=>{const g=i.totalQty>0?i.totalBuyValue/i.totalQty:0,u=i.totalEvalKRW-i.totalInvestedKRW,v=i.totalInvestedKRW>0?u/i.totalInvestedKRW*100:0,y=u>=0?"up":"down",h=u>=0?"▲":"▼",p=i.dailyPct===0?"":i.dailyPct>0?"▲":"▼",b=i.isUsdCash?"USD 현금":i.symbol.replace(".KS","").replace(".KQ",""),S=document.createElement("div");S.className="pf-summary-table-row",S.innerHTML=`
                <div class="pf-col-name">
                    <div class="pf-stock-info">
                        <span class="pf-stock-name">${i.name}</span>
                        <span class="pf-stock-symbol">${b}</span>
                    </div>
                </div>
                <div class="pf-col-price">
                    <span class="pf-current-price">${i.isUsdCash?`₩${Math.round(C).toLocaleString()}`:i.currentPrice?`${i.currencySymbol}${i.currentPrice.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:"-"}</span>
                    <span class="pf-daily-change ${i.dailyDirection}">${i.isUsdCash?"환율 기준 평가":`${p?`${p} `:""}${Math.abs(i.dailyPct).toFixed(2)}%`}</span>
                </div>
                <div class="pf-col-qty">
                    <span class="pf-summary-main">${i.totalQty.toLocaleString()}</span>
                    <span class="pf-summary-subtext">합산 수량</span>
                </div>
                <div class="pf-col-buy">
                    <span class="pf-summary-main">${g>0?`${i.isUsdCash?"₩":i.currencySymbol}${g.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:"-"}</span>
                    <span class="pf-summary-subtext">평가금 ₩${Math.round(i.totalEvalKRW).toLocaleString()}</span>
                </div>
                <div class="pf-col-gain ${y}">
                    <span class="pf-gain-amount ${y}">${h} ₩${Math.abs(Math.round(u)).toLocaleString()}</span>
                    <span class="pf-gain-pct ${y}">${h} ${Math.abs(v).toFixed(2)}%</span>
                </div>
            `,l.appendChild(S)}),s.appendChild(l),r.appendChild(c),t.appendChild(s),t.appendChild(r),tt(wt(e)),et(o,a),t.querySelectorAll(".btn-edit-stock").forEach(i=>{i.addEventListener("click",g=>{g.stopPropagation(),Ne(i.dataset.portfolioId)})}),t.querySelectorAll(".btn-remove-stock").forEach(i=>{i.addEventListener("click",g=>{g.stopPropagation();const u=i.dataset.symbol,v=i.dataset.portfolioId;confirm(`${u}을(를) 포트폴리오에서 삭제하시겠습니까?`)&&We(v)})}),t.querySelectorAll(".pf-table-row").forEach(i=>{i.addEventListener("click",g=>{if(g.target.closest(".btn-remove-stock")||g.target.closest(".btn-edit-stock"))return;const u=i.dataset.symbol,v=i.dataset.portfolioId,y=m.portfolio.find(p=>p.id===v);if((y==null?void 0:y.market)==="cash_usd"||u==="USD-CASH")return;const h=e.find(p=>p.symbol===u);h&&Wt(h)})})}function ot(t,e){const o=e.find(p=>p.symbol===t.symbol),a=t.qty||1,n=t.buyPrice||0,s=t.market==="cash_usd"||t.symbol==="USD-CASH",l=t.market==="cash_krw"||t.symbol==="KRW-CASH",r=l||t.currency==="KRW"||t.market==="korean",c=He(t,o,s,l),d=(o==null?void 0:o.price)||0,i=(s?C:r?l?1:d:d*C)*a,u=(s||r?n:n*C)*a,v=n>0?i-u:0,y=n>0?s?(C-n)/n*100:(d-n)/n*100:0;return{liveData:o,qty:a,buyPrice:n,isUsdCash:s,isKrwCash:l,isKRW:r,categoryKey:c,currentPrice:d,evalTotalKRW:i,investedKRW:u,gainKRW:v,gainPct:y,includeInSummary:_||!s&&!l}}function He(t,e,o,a){const n=["etf_us","etf_kr"].includes(e==null?void 0:e.theme)||t.market==="etf",s=(e==null?void 0:e.theme)==="crypto"||t.market==="crypto",l=!n&&!s&&(t.market==="korean"||(e==null?void 0:e.currency)==="KRW");return o||a?"cash":s?"crypto":n?"etf":l?"korean":"overseas"}function Ue(t){return T==="all"?!0:t.categoryKey===T}function wt(t){const e=new Map([["korean",{key:"korean",label:"국내주식",color:"#10b981",value:0,invested:0}],["overseas",{key:"overseas",label:"해외주식",color:"#f59e0b",value:0,invested:0}],["etf",{key:"etf",label:"ETF",color:"#38bdf8",value:0,invested:0}],["crypto",{key:"crypto",label:"코인",color:"#ef4444",value:0,invested:0}],["cash",{key:"cash",label:"원화/현금",color:"#6366f1",value:0,invested:0}]]);return m.portfolio.forEach(a=>{const{categoryKey:n,evalTotalKRW:s,investedKRW:l}=ot(a,t);n==="cash"?(e.get("cash").value+=s,e.get("cash").invested+=l):n==="crypto"?(e.get("crypto").value+=s,e.get("crypto").invested+=l):n==="etf"?(e.get("etf").value+=s,e.get("etf").invested+=l):n==="korean"?(e.get("korean").value+=s,e.get("korean").invested+=l):(e.get("overseas").value+=s,e.get("overseas").invested+=l)}),Array.from(e.entries()).filter(([a,n])=>n.value>0&&(_||a!=="cash")).map(([,a])=>({...a,gain:a.value-a.invested})).sort((a,n)=>n.value-a.value)}function tt(t){const e=document.getElementById("pfAllocationLegend");if(!e)return;const o=t.reduce((a,n)=>a+n.value,0)||1;if(le("pfAllocationChart",t,{activeKey:T,onSliceClick:It}),!t.length){e.innerHTML='<div class="custom-empty">구성 비율을 표시할 자산이 없습니다.</div>';return}e.innerHTML=t.map(a=>{const n=a.value/o*100,s=a.gain>=0?"up":"down",l=a.gain>=0?"▲":"▼";return`
            <button class="pf-allocation-item ${T===a.key?"active":""}" type="button" data-allocation-key="${a.key}">
                <span class="pf-allocation-dot" style="background:${a.color}"></span>
                <span class="pf-allocation-name">${a.label}</span>
                <div class="pf-allocation-meta">
                    <span class="pf-allocation-value">₩${Math.round(a.value).toLocaleString()}</span>
                    <span class="pf-allocation-pct">${n.toFixed(1)}%</span>
                    <span class="pf-allocation-gain ${s}">${l} ₩${Math.abs(Math.round(a.gain)).toLocaleString()}</span>
                </div>
            </button>
        `}).join(""),e.querySelectorAll("[data-allocation-key]").forEach(a=>{a.addEventListener("click",()=>{It(a.dataset.allocationKey)})})}function et(t,e){const o=document.getElementById("pfTotalKRW"),a=document.getElementById("pfTotalInvested"),n=document.getElementById("pfTotalGain"),s=document.getElementById("pfTotalGainPct");o&&(o.textContent=`₩${Math.round(t).toLocaleString()}`),a&&(a.textContent=`₩${Math.round(e).toLocaleString()}`);const l=t-e,r=e>0?l/e*100:0,c=l>=0?"up":"down",d=l>=0?"▲":"▼";n&&(n.textContent=`${d} ₩${Math.abs(Math.round(l)).toLocaleString()}`,n.className=`pf-summary-value ${c}`),s&&(s.textContent=`${d} ${Math.abs(r).toFixed(2)}%`,s.className=`pf-summary-sub ${c}`)}function Ct(){document.querySelectorAll("[data-cash-toggle]").forEach(t=>{const e=t.dataset.cashToggle==="include"===_;t.classList.toggle("active",e),t.setAttribute("aria-pressed",e?"true":"false")})}function It(t){T=T===t?"all":t,R()}export{_e as initDashboard,qe as refreshData};
