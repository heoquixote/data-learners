import{f as _e,a as qe,b as Qe,c as Ge,d as O,e as je,g as Oe,h as Le,t as ze,i as Q,j as Ye,k as Ze,l as Xe,m as Je,n as et,s as se,o as tt,p as nt}from"./index-XNPirX_O.js";function pe(e,t={}){const{onToggleFavorite:o}=t,a=e.dailyChangePercent??e.changePercent??0,n=e.monthlyChangePercent??null,s=a===0,l=a>0,r=s?"neutral":l?"up":"down",c=e.currency==="KRW"?"₩":"$",d=ot(e.price,e.currency),f=s?"":l?"▲":"▼",i=`${f?`${f} `:""}${Math.abs(a).toFixed(2)}%`;let g="";if(n!=null){const E=n>=0;g=`
          <div class="stock-monthly ${E?"up":"down"}">
            <span class="monthly-label">전월비</span>
            <span class="monthly-value">${E?"▲":"▼"} ${Math.abs(n).toFixed(2)}%</span>
          </div>`}const u=document.createElement("div");u.className=`stock-card ${r}`,u.dataset.symbol=e.symbol,u.dataset.favorite=e.isFavorite?"true":"false",e.symbol.includes(".KS")||e.symbol.includes(".KQ");const v=e.symbol.replace(".KS","").replace(".KQ",""),y=e.name||v,h=v,p=e.isFavorite?"active":"",b=e.isFavorite?"즐겨찾기 해제":"즐겨찾기 추가";u.innerHTML=`
    <div class="stock-card-header">
      <div>
        <div class="stock-symbol">${y}</div>
        <div class="stock-name">${h}</div>
      </div>
      <div class="stock-card-actions">
        ${e.recommendation?`
          <span class="stock-badge ${at(e.recommendation)}">${e.recommendation}</span>
        `:""}
        <button class="stock-favorite-btn ${p}" type="button" data-favorite-symbol="${e.symbol}" aria-label="${b}">
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
    <button class="stock-chart-link" type="button" data-chart-symbol="${e.symbol}" aria-label="${y} 차트 열기">
      <canvas class="stock-sparkline" id="sparkline-${e.symbol.replace(/[^a-zA-Z0-9]/g,"_")}"></canvas>
    </button>
  `;const S=u.querySelector(".stock-favorite-btn");return S&&typeof o=="function"&&S.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),o(e.symbol)}),u}function at(e){return e?e.includes("매수")||e==="BUY"?"buy":e.includes("매도")||e==="SELL"?"sell":"hold":""}function ot(e,t){return e?t==="KRW"?Math.round(e).toLocaleString():e.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}):"0"}function Be(e,t,o){const a=document.getElementById(e);if(!a||!t.length)return;const n=a.getContext("2d"),s=a.getBoundingClientRect();a.width=s.width*2,a.height=s.height*2,n.scale(2,2);const l=s.width,r=s.height,c=4,d=t.map(p=>p.close||p.price||0).filter(p=>p>0);if(d.length<2)return;const f=Math.min(...d),g=Math.max(...d)-f||1,u=getComputedStyle(document.documentElement),v=o?u.getPropertyValue("--color-up").trim()||"#ef4444":u.getPropertyValue("--color-down").trim()||"#3b82f6",y=d.map((p,b)=>({x:c+b/(d.length-1)*(l-c*2),y:c+(1-(p-f)/g)*(r-c*2)})),h=n.createLinearGradient(0,0,0,r);h.addColorStop(0,o?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)"),h.addColorStop(1,"rgba(0,0,0,0)"),n.beginPath(),n.moveTo(y[0].x,y[0].y);for(let p=1;p<y.length;p++)n.lineTo(y[p].x,y[p].y);n.lineTo(y[y.length-1].x,r),n.lineTo(y[0].x,r),n.closePath(),n.fillStyle=h,n.fill(),n.beginPath(),n.moveTo(y[0].x,y[0].y);for(let p=1;p<y.length;p++)n.lineTo(y[p].x,y[p].y);n.strokeStyle=v,n.lineWidth=1.5,n.stroke()}let W=null,H=null;const st={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(11, 13, 14, 0.96)",titleColor:"#f5f7f2",bodyColor:"#c9cfcb",borderColor:"rgba(200, 255, 61, 0.35)",borderWidth:1,padding:12,cornerRadius:6,titleFont:{size:13,weight:"600",family:"Space Grotesk, Pretendard Variable, sans-serif"},bodyFont:{size:12,family:"Space Grotesk, Pretendard Variable, sans-serif"},callbacks:{label:function(e){return` ${e.parsed.y.toLocaleString()}`}}}},scales:{x:{grid:{color:"rgba(255, 255, 255, 0.06)",lineWidth:1},ticks:{color:"#879089",font:{size:11,family:"Space Grotesk, Pretendard Variable, sans-serif"},maxRotation:0,autoSkip:!0,maxTicksLimit:8}},y:{position:"right",grid:{color:"rgba(255, 255, 255, 0.06)",lineWidth:1},ticks:{color:"#879089",font:{size:11,family:"Space Grotesk, Pretendard Variable, sans-serif"},callback:function(e){return e.toLocaleString()}}}},interaction:{intersect:!1,mode:"index"},elements:{point:{radius:0,hoverRadius:5}}};function rt(e,t,o="가격"){const a=document.getElementById(e);if(!a||(W&&(W.destroy(),W=null),!t||t.length===0))return;const n=a.getContext("2d"),s=t.map(i=>i.close||0),l=s[s.length-1]>=s[0],r=getComputedStyle(document.documentElement),c=l?r.getPropertyValue("--color-up").trim()||"#ef4444":r.getPropertyValue("--color-down").trim()||"#3b82f6",d=n.createLinearGradient(0,0,0,200);d.addColorStop(0,l?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)"),d.addColorStop(1,"rgba(0,0,0,0)");const f=t.map(i=>{const g=new Date(i.date);return`${g.getMonth()+1}/${g.getDate()}`});return W=new Chart(n,{type:"line",data:{labels:f,datasets:[{label:o,data:s,borderColor:c,backgroundColor:d,borderWidth:2,fill:!0,tension:.3}]},options:{...st}}),W}function lt(e,t=[],o={}){const a=document.getElementById(e);if(!a||(H&&(H.destroy(),H=null),!t.length))return null;const n=a.getContext("2d"),{activeKey:s="all",onSliceClick:l}=o;return H=new Chart(n,{type:"doughnut",data:{labels:t.map(r=>r.label),datasets:[{data:t.map(r=>r.value),backgroundColor:t.map(r=>r.color||"#64748b"),borderColor:t.map(r=>s==="all"||r.key===s?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.02)"),borderWidth:t.map(r=>s==="all"||r.key===s?2:1),hoverOffset:8,offset:t.map(r=>s==="all"?0:r.key===s?14:0)}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"62%",onClick:(r,c)=>{if(!c.length||typeof l!="function")return;const d=c[0].index,f=t[d];f&&l(f.key)},plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(11, 13, 14, 0.96)",titleColor:"#f5f7f2",bodyColor:"#c9cfcb",borderColor:"rgba(200, 255, 61, 0.25)",borderWidth:1,callbacks:{label(r){const c=t.reduce((i,g)=>i+g.value,0)||1,d=r.parsed||0,f=d/c*100;return` ₩${Math.round(d).toLocaleString()} (${f.toFixed(1)}%)`}}}}}}),H}let U="all",re="all",K="all",P="all",le="all",V="",z="all",_=!0,T="all";const fe={all:[{id:"all",label:"전체"}],korean:[{id:"all",label:"전체"},{id:"kr_major",label:"🇰🇷 대표주"},{id:"kr_finance",label:"🏦 금융"},{id:"kr_battery",label:"🔋 2차전지"},{id:"kr_defense",label:"🛡️ 방산"},{id:"kr_bio",label:"🧬 바이오"},{id:"kr_it",label:"💻 IT/플랫폼"},{id:"kr_entertainment",label:"🎤 엔터"},{id:"kr_heavy",label:"🏗️ 중공업"},{id:"kr_consumer",label:"🛒 소비/유통"}],overseas:[{id:"all",label:"전체"},{id:"tech",label:"🖥️ 기술주"},{id:"semiconductor",label:"💾 반도체"},{id:"obesity_drug",label:"💉 비만 치료제/의약"},{id:"ai_data",label:"🤖 AI/데이터"},{id:"defense",label:"🛡️ 방산"},{id:"energy",label:"⚡ 에너지"},{id:"consumer",label:"🛒 소비재"},{id:"healthcare",label:"💊 헬스케어"},{id:"finance",label:"🏦 금융"},{id:"communication",label:"📡 통신/미디어"},{id:"industrial",label:"🏭 산업재"},{id:"commodity",label:"🥇 귀금속"},{id:"minerals",label:"⛏️ 원자재/광물"}],etf:[{id:"all",label:"전체"},{id:"etf_us",label:"🌎 해외 ETF"},{id:"etf_kr",label:"🇰🇷 국내 ETF"}],crypto:[{id:"all",label:"전체"},{id:"crypto",label:"🪙 주요 코인"}]},m={overseas:[],korean:[],gold:[],crypto:[],news:{updatedAt:null,categories:[],items:{}},custom:[],privateHistory:[],favorites:Q("favorites",[]),strategyMemo:Q("strategyMemo",{}).text||"",strategyMemoSavedAt:Q("strategyMemo",{}).savedAt||"",portfolio:Ae(Q("portfolio",[])),loading:!1};function Me(){return`pf_${Date.now()}_${Math.random().toString(36).slice(2,8)}`}function ce(){const e=new Date,t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${o}-${a}`}function Ae(e=[]){return e.map(t=>{var o;return{...t,id:t.id||Me(),buyDate:t.buyDate||((o=t.addedAt)==null?void 0:o.slice(0,10))||""}})}async function _t(){vt(),$t(),It(),Et(),kt(),wt(),Ct(),Lt(),Bt(),At(),xt(),Tt(),Kt(),bt(),Ne(),await Y()}async function Y(){var e;m.loading=!0,Ee(!0);try{const[t,o,a,n,s,l,r,c]=await Promise.all([_e().catch(()=>({data:[]})),qe().catch(()=>({data:[]})),Qe().catch(()=>({data:[]})),Ge().catch(()=>({data:[]})),O().catch(()=>({data:[]})),je().catch(()=>({data:{updatedAt:null,categories:[],items:{}}})),Oe().catch(()=>({data:[]})),Le().catch(()=>({data:null}))]);m.overseas=t.data||[],m.korean=o.data||[],m.gold=a.data||[],m.crypto=n.data||[],m.news=l.data||{updatedAt:null,categories:[],items:{}},m.custom=s.data||[],m.privateHistory=r.data||[],He((e=c.data)==null?void 0:e.usdKrw),I(),ie(),Pt(),Ft()}catch(t){console.error("데이터 로드 실패:",t)}finally{m.loading=!1,Ee(!1)}}async function ie(){const e=D(),t=e.filter(g=>(g.dailyChangePercent??g.changePercent??0)>0).length,o=e.filter(g=>(g.dailyChangePercent??g.changePercent??0)<0).length,a=e.filter(g=>(g.dailyChangePercent??g.changePercent??0)===0).length,n=e.filter(g=>g.price>0).length,s=document.getElementById("totalCount"),l=document.getElementById("upCount"),r=document.getElementById("downCount"),c=document.getElementById("coverageCount"),d=document.getElementById("flatCountMeta"),f=document.getElementById("upBreakdown"),i=document.getElementById("downBreakdown");s&&(s.textContent=e.length),l&&(l.textContent=t),r&&(r.textContent=o),d&&(d.textContent=`보합 ${a}`),f&&(f.innerHTML=ge(e,"up")),i&&(i.innerHTML=ge(e,"down")),c&&(c.textContent=`${n}/${e.length}`,c.title=`종가 기준 ${n}개 종목 수집 완료`),Re();try{const u=(await Ye()).data||[],v={"USD/KRW":{valueId:"usdKrwValue",changeId:"usdKrwChange",cardId:"cardUsdKrw"},US10Y:{valueId:"us10yValue",changeId:"us10yChange",cardId:"cardUs10Y"},US13W:{valueId:"us13wValue",changeId:"us13wChange",cardId:"cardUs13W"},DXY:{valueId:"dxyValue",changeId:"dxyChange",cardId:"cardDxy"},VIX:{valueId:"vixValue",changeId:"vixChange",cardId:"cardVix"},MVRV_Z:{valueId:"mvrvZValue",changeId:"mvrvZChange",cardId:"cardMvrvZ"}};u.forEach(y=>{const h=v[y.key];if(!h)return;const p=document.getElementById(h.valueId),b=document.getElementById(h.changeId),S=document.getElementById(h.cardId),E=typeof y.changePercent=="number",w=Number(y.changePercent)||0,M=typeof y.changeValue=="number",k=Number(y.changeValue)||0,L=E?w>=0:k>=0;if(p&&(p.textContent=it(y)),b)if(E){const A=L?"▲":"▼";b.textContent=`${A} ${Math.abs(w).toFixed(2)}%`,b.className=`card-change ${L?"up":"down"}`}else if(M){const A=L?"▲":"▼";b.textContent=`${A} ${Math.abs(k).toFixed(2)}pt`,b.className=`card-change ${L?"up":"down"}`}else b.textContent="기준 환율",b.className="card-change neutral";S&&(S.classList.remove("up","down"),(E||M)&&S.classList.add(L?"up":"down"))})}catch(g){console.error("매크로 지표 로드 실패:",g)}try{const u=(await Ze()).data||[],v={"^GSPC":{priceId:"sp500Price",changeId:"sp500Change",cardId:"cardSP500",sparkId:"sparkline-GSPC"},"^NDX":{priceId:"nasdaqPrice",changeId:"nasdaqChange",cardId:"cardNASDAQ",sparkId:"sparkline-NDX"},"^KS11":{priceId:"kospiPrice",changeId:"kospiChange",cardId:"cardKOSPI",sparkId:"sparkline-KS11"},"^KQ11":{priceId:"kosdaqPrice",changeId:"kosdaqChange",cardId:"cardKOSDAQ",sparkId:"sparkline-KQ11"}};u.forEach(y=>{var M;const h=v[y.symbol];if(!h)return;const p=document.getElementById(h.priceId),b=document.getElementById(h.changeId),S=document.getElementById(h.cardId);p&&y.price!=null&&(p.textContent=y.price.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}));const E=y.changePercent||0,w=E>=0;if(b){const k=w?"▲":"▼";b.textContent=`${k} ${Math.abs(E).toFixed(2)}%`,b.className=`card-change ${w?"up":"down"}`}S&&(S.classList.remove("up","down"),S.classList.add(w?"up":"down")),h.sparkId&&((M=y.history)==null?void 0:M.length)>0&&setTimeout(()=>{Be(h.sparkId,y.history,w)},100)})}catch(g){console.error("시장 지수 로드 실패:",g)}}function ct(e){const t=e.market||"",o=e.theme||"",a=e.symbol||"";return o==="crypto"||t==="crypto"?"crypto":["etf_us","etf_kr"].includes(o)||t==="etf"?"etf":t==="korean"||e.currency==="KRW"||a.endsWith(".KS")||a.endsWith(".KQ")?"korean":"overseas"}function ge(e,t){return[["korean","국내"],["overseas","해외"],["etf","ETF"],["crypto","코인"]].map(([a,n])=>{const s=e.filter(d=>ct(d)===a),l=s.filter(d=>{const f=Number(d.dailyChangePercent??d.changePercent??0);return t==="up"?f>0:f<0}).length,r=s.length,c=r>0?l/r*100:0;return`
                <div class="card-breakdown-item">
                    <span class="card-breakdown-label">${n}</span>
                    <span class="card-breakdown-count">${l}/${r}</span>
                    <span class="card-breakdown-dot">·</span>
                    <span class="card-breakdown-ratio">${c.toFixed(0)}%</span>
                </div>
            `}).join("")}function it(e){if(e.value==null)return"-";switch(e.format){case"krw":return`₩${Number(e.value).toLocaleString("ko-KR",{minimumFractionDigits:0,maximumFractionDigits:0})}`;case"percent":return`${Number(e.value).toFixed(2)}%`;default:return Number(e.value).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}}function D(){return[...m.overseas,...m.korean,...m.gold,...m.crypto,...m.custom]}function I(){const e=document.getElementById("viewTitle"),t=document.getElementById("summaryCards"),o=document.getElementById("stocksSection"),a=document.getElementById("newsSection"),n=document.getElementById("chartSection"),s=document.getElementById("portfolioSection"),l=document.getElementById("historySection"),r=document.getElementById("strategySection"),c=document.getElementById("heatmapSection"),d=document.getElementById("marketFilterBar");switch(t&&(t.style.display="grid"),o.style.display="block",a&&(a.style.display="none"),n.style.display="none",s&&(s.style.display="none"),l&&(l.style.display="none"),r&&(r.style.display="none"),c&&(c.style.display="none"),U){case"all":e.textContent="대시보드",d.style.display="flex",ve(he());break;case"news":e.textContent="🗞️ 시장 뉴스",t&&(t.style.display="none"),o.style.display="none",a&&(a.style.display="block"),d.style.display="none",xe();break;case"portfolio":e.textContent="💼 내 포트폴리오",t&&(t.style.display="none"),o.style.display="none",s&&(s.style.display="block"),d.style.display="none",R();break;case"history":e.textContent="🧾 히스토리",t&&(t.style.display="none"),o.style.display="none",d.style.display="none",l&&(l.style.display="block"),mt();break;case"strategy":e.textContent="📝 투자 전략",t&&(t.style.display="none"),o.style.display="none",d.style.display="none",r&&(r.style.display="block"),St();break;case"heatmap":e.textContent="🗺️ 히트맵",t&&(t.style.display="none"),o.style.display="none",d.style.display="none",c&&(c.style.display="block");break;default:U="all",e.textContent="대시보드",d.style.display="flex",ve(he());break}}function he(){let e=dt(re);if(K!=="all"&&(e=e.filter(t=>t.theme===K)),P!=="all"&&(e=e.filter(t=>{const o=t.dailyChangePercent??t.changePercent??0;switch(P){case"up":return o>0;case"down":return o<0;case"spike":return o>=5;case"crash":return o<=-5;default:return!0}})),le==="favorites"&&(e=e.filter(t=>Z(t.symbol))),V){const t=V.toLowerCase();e=e.filter(o=>[o.name,o.symbol,o.korCode,o.themeName,o.theme].filter(Boolean).map(n=>String(n).toLowerCase()).some(n=>n.includes(t)))}return e}function dt(e){switch(e){case"korean":return[...m.korean,...m.custom.filter(t=>t.market==="korean")];case"overseas":return[...m.overseas,...m.gold,...m.custom.filter(t=>!["korean","etf","crypto"].includes(t.market))];case"etf":return[...[...m.overseas,...m.korean].filter(t=>["etf_us","etf_kr"].includes(t.theme)),...m.custom.filter(t=>t.market==="etf")];case"crypto":return[...m.crypto,...m.custom.filter(t=>t.market==="crypto")];case"all":default:return D()}}function ve(e){const t=document.getElementById("stocksGrid");if(t.innerHTML="",!e.length){t.innerHTML=V?`<div class="stocks-empty">"${V}" 검색 결과가 없습니다.</div>`:`<div class="stocks-empty">데이터가 없습니다. '수집' 버튼을 클릭해주세요.</div>`;return}const o={},a=[];e.forEach(n=>{n.themeName?(o[n.themeName]||(o[n.themeName]=[]),o[n.themeName].push(n)):a.push(n)});for(const[n,s]of Object.entries(o)){const l=document.createElement("div");l.className="theme-section",l.innerHTML=`<div class="theme-header"><h3 class="theme-title">${n}</h3><span class="theme-count">${s.length}종목</span></div>`;const r=document.createElement("div");r.className="stocks-grid",s.forEach(c=>{const d=pe({...c,isFavorite:Z(c.symbol)},{onToggleFavorite:ae});r.appendChild(d)}),l.appendChild(r),t.appendChild(l),setTimeout(()=>{s.forEach(c=>{const d=`sparkline-${c.symbol.replace(/[^a-zA-Z0-9]/g,"_")}`,f=c.dailyChangePercent??c.changePercent??0,i=c.history&&c.history.length>=2?c.history:ut(c.price);Be(d,i,f>=0)})},100)}if(a.length>0){const n=document.createElement("div");n.className="stocks-grid",a.forEach(s=>{const l=pe({...s,isFavorite:Z(s.symbol)},{onToggleFavorite:ae});n.appendChild(l)}),t.appendChild(n)}}function ut(e){const t=[];let o=e*(.97+Math.random()*.06);for(let a=0;a<20;a++)o+=o*.008*(Math.random()-.45),t.push({close:o});return t}function xe(){const e=document.getElementById("newsGrid"),t=document.getElementById("newsUpdatedAt");if(!e)return;const o=m.news||{},a=o.updatedAt,n=o.items||{};t&&(t.textContent=`뉴스 수집 시각: ${a?be(a):"-"}`);const l=(z==="all"?Object.values(n).flat():n[z]||[]).filter(r=>(r==null?void 0:r.title)&&(r==null?void 0:r.link)).sort((r,c)=>new Date(c.publishedAt||0)-new Date(r.publishedAt||0));if(!l.length){e.innerHTML='<div class="stocks-empty">표시할 뉴스가 없습니다. 종가 수집 배치를 한 번 실행하면 채워집니다.</div>';return}e.innerHTML=l.map(r=>`
        <article class="news-card" data-news-cat="${r.category||""}">
            <div class="news-card-top">
                <span class="news-badge" data-news-cat="${r.category||""}">${r.categoryName||r.category}</span>
                <span class="news-time">${r.publishedAt?be(r.publishedAt):"시간 정보 없음"}</span>
            </div>
            <a class="news-title" href="${r.link}" target="_blank" rel="noopener noreferrer">${r.title}</a>
            <p class="news-summary">${r.summary||r.title}</p>
            <div class="news-card-bottom">
                <span class="news-source">${r.source||"출처 미상"}</span>
                <a class="news-link" href="${r.link}" target="_blank" rel="noopener noreferrer">원문 보기</a>
            </div>
        </article>
    `).join("")}function mt(){const e=document.getElementById("historyContent");if(!e)return;const t=m.privateHistory||[];if(!t.length){e.innerHTML='<div class="history-empty">등록된 히스토리가 없습니다.</div>';return}const o=yt(t);e.innerHTML=`
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
        ${t.map(a=>{var d,f,i,g;const n=a.historyType==="cashflow",s=n?Fe(a.transactions):Pe(a.transactions),l=(a.holdings||[]).reduce((u,v)=>u+v.value,0),r=Te(a),c=typeof r=="number"?r-Ke(a):null;return`
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
                        <span class="history-summary-sub">최초 ${G(s.firstDate)} · 마지막 ${G(s.lastDate)}</span>
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
                                            <span>${u.label} ${G(u.date)}</span>
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
                                <span>${G(u.date)}</span>
                                <span class="history-trade-type ${u.type}">${ft(u.type)}</span>
                                <span>${n?$(u.amount):`${u.shares.toLocaleString()}주`}</span>
                                <span>${n?$(u.balance):$(u.price,!1)}</span>
                                <span>${n?gt(u):$(u.amount)}</span>
                            </div>
                        `).join("")}
                </div>
            </article>
        `}).join("")}`}function Pe(e){var r,c;const t=e.filter(d=>d.type==="buy"),o=e.filter(d=>d.type==="sell"),a=t.reduce((d,f)=>d+f.amount,0),n=o.reduce((d,f)=>d+f.amount,0),s=t.reduce((d,f)=>d+f.shares,0),l=o.reduce((d,f)=>d+f.shares,0);return{buyAmount:a,sellAmount:n,buyShares:s,sellShares:l,buyAvgPrice:s>0?a/s:0,sellAvgPrice:l>0?n/l:0,remainingShares:s-l,netInvested:a-n,tradeCount:e.length,firstDate:(r=e[0])==null?void 0:r.date,lastDate:(c=e[e.length-1])==null?void 0:c.date}}function Fe(e){var s,l;const t=e.filter(r=>r.type==="deposit"),o=e.filter(r=>r.type==="withdrawal"),a=t.reduce((r,c)=>r+c.amount,0),n=o.reduce((r,c)=>r+c.amount,0);return{depositAmount:a,withdrawalAmount:n,depositCount:t.length,withdrawalCount:o.length,netAmount:a-n,tradeCount:e.length,firstDate:(s=e[0])==null?void 0:s.date,lastDate:(l=e[e.length-1])==null?void 0:l.date}}function yt(e){const t=e.map(o=>{const a=Ke(o),n=Te(o),s=typeof n=="number";return{name:o.name,netInvested:a,currentValue:n,hasCurrentValue:s,pnl:s?n-a:null}});return{totalNetInvested:t.reduce((o,a)=>o+a.netInvested,0),totalKnownValue:t.filter(o=>o.hasCurrentValue).reduce((o,a)=>o+a.currentValue,0),totalKnownPnL:t.filter(o=>o.hasCurrentValue).reduce((o,a)=>o+a.pnl,0),unvaluedNetInvested:t.filter(o=>!o.hasCurrentValue).reduce((o,a)=>o+a.netInvested,0),valuedAssetCount:t.filter(o=>o.hasCurrentValue).length,unvaluedNames:t.filter(o=>!o.hasCurrentValue).map(o=>o.name)}}function Ke(e){return e.historyType==="cashflow"?Fe(e.transactions).netAmount:Pe(e.transactions).netInvested}function Te(e){if(e.historyType!=="cashflow")return null;const t=pt(e.balanceSnapshots||[]),o=(e.holdings||[]).reduce((a,n)=>a+n.value,0);return((t==null?void 0:t.value)||0)+o}function pt(e=[]){return e.slice().sort((t,o)=>new Date(o.date)-new Date(t.date))[0]||null}function $(e,t=!0){const o=Math.round(e||0).toLocaleString("ko-KR");return t?`₩${o}`:`${o}원`}function G(e){const t=new Date(e);return Number.isNaN(t.getTime())?"-":t.toLocaleDateString("ko-KR",{year:"2-digit",month:"2-digit",day:"2-digit"})}function ft(e){return{buy:"매수",sell:"매도",deposit:"입금",withdrawal:"출금"}[e]||e}function gt(e){return e.type==="deposit"?"계좌 입금":"계좌 출금"}function ht(e){var t,o,a,n;return e!=null&&e.externalUrl?e.externalUrl:e!=null&&e.korCode?`https://finance.naver.com/item/main.naver?code=${e.korCode}`:(t=e==null?void 0:e.symbol)!=null&&t.endsWith(".KS")||(o=e==null?void 0:e.symbol)!=null&&o.endsWith(".KQ")?`https://finance.naver.com/item/main.naver?code=${e.symbol.replace(".KS","").replace(".KQ","")}`:(a=e==null?void 0:e.symbol)!=null&&a.includes("-USD")||(n=e==null?void 0:e.symbol)!=null&&n.includes("=F")?`https://www.google.com/finance/quote/${encodeURIComponent(e.symbol)}`:""}function be(e){const t=new Date(e);return Number.isNaN(t.getTime())?"-":t.toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function vt(){document.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",()=>{U=e.dataset.view,document.querySelectorAll(".nav-item").forEach(t=>t.classList.remove("active")),e.classList.add("active"),I()})})}function bt(){const e=document.getElementById("strategyMemoInput"),t=document.getElementById("strategyClearBtn");e&&(e.value=m.strategyMemo||"",e.addEventListener("input",()=>{m.strategyMemo=e.value,m.strategyMemoSavedAt=new Date().toISOString(),Se(),ne()})),t&&t.addEventListener("click",()=>{m.strategyMemo="",m.strategyMemoSavedAt=new Date().toISOString(),Se(),e&&(e.value=""),ne()})}function Se(){se("strategyMemo",{text:m.strategyMemo,savedAt:m.strategyMemoSavedAt})}function St(){const e=document.getElementById("strategyMemoInput");e&&e.value!==m.strategyMemo&&(e.value=m.strategyMemo||""),ne()}function ne(){const e=document.getElementById("strategySavedAt");if(!e)return;if(!m.strategyMemoSavedAt){e.textContent="저장 기록 없음";return}const t=new Date(m.strategyMemoSavedAt);if(Number.isNaN(t.getTime())){e.textContent="방금 저장됨";return}e.textContent=`자동 저장: ${t.toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`}function $t(){document.querySelectorAll(".filter-tab").forEach(e=>{e.addEventListener("click",()=>{re=e.dataset.filter,document.querySelectorAll(".filter-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),K="all",Ne(),I()})})}function Et(){document.querySelectorAll(".movement-chip").forEach(e=>{e.addEventListener("click",()=>{P=e.dataset.movement,De(),I()})})}function kt(){document.querySelectorAll(".favorite-chip").forEach(e=>{e.addEventListener("click",()=>{le=e.dataset.favoriteFilter||"all",$e(),I()})}),$e()}function wt(){Object.entries({cardTotal:"all",cardUp:"up",cardDown:"down"}).forEach(([t,o])=>{const a=document.getElementById(t);a&&(a.classList.add("summary-card-filter"),a.addEventListener("click",()=>{P=o,De(),I()}))})}function Ct(){const e=document.getElementById("summaryBreakdownTooltip");if(!e)return;const t=document.querySelectorAll("[data-breakdown-source]"),o=()=>{e.classList.remove("active"),e.setAttribute("aria-hidden","true")},a=n=>{const l=e.offsetWidth||240,r=e.offsetHeight||120,c=Math.min(n.clientX+18,window.innerWidth-l-12),d=Math.min(n.clientY+18,window.innerHeight-r-12);e.style.left=`${Math.max(12,c)}px`,e.style.top=`${Math.max(12,d)}px`};t.forEach(n=>{const s=n.dataset.breakdownSource,l=document.getElementById(s);l&&(n.addEventListener("mouseenter",r=>{l.innerHTML.trim()&&(e.innerHTML=l.innerHTML,e.classList.add("active"),e.setAttribute("aria-hidden","false"),a(r))}),n.addEventListener("mousemove",r=>{e.classList.contains("active")&&a(r)}),n.addEventListener("mouseleave",o))})}function De(){document.querySelectorAll(".movement-chip").forEach(e=>{e.classList.toggle("active",e.dataset.movement===P)}),Re()}function $e(){document.querySelectorAll(".favorite-chip").forEach(e=>{e.classList.toggle("active",e.dataset.favoriteFilter===le)})}function Re(){Object.entries({cardTotal:P==="all",cardUp:P==="up",cardDown:P==="down"}).forEach(([t,o])=>{const a=document.getElementById(t);a&&a.classList.toggle("active-filter",o)})}function It(){const e=document.getElementById("categoryFilters");e&&e.addEventListener("click",t=>{const o=t.target.closest(".category-chip");o&&(K=o.dataset.category,Mt(),I())})}function Lt(){const e=document.getElementById("stockSearchInput");e&&e.addEventListener("input",t=>{V=t.target.value.trim(),I()})}function Bt(){document.querySelectorAll(".news-tab").forEach(e=>{e.addEventListener("click",()=>{z=e.dataset.newsFilter||"all",document.querySelectorAll(".news-tab").forEach(t=>{t.classList.toggle("active",t.dataset.newsFilter===z)}),U==="news"&&xe()})})}function Ne(){var a;const e=document.getElementById("categoryFilters");if(!e)return;const t=fe[re]||fe.all,o=((a=e.querySelector(".filter-group-label"))==null?void 0:a.outerHTML)||'<span class="filter-group-label">카테고리</span>';e.innerHTML=`${o}${t.map(n=>`
        <button class="category-chip${n.id===K?" active":""}" data-category="${n.id}">
            ${n.label}
        </button>
    `).join("")}`}function Mt(){document.querySelectorAll(".category-chip").forEach(e=>{e.classList.toggle("active",e.dataset.category===K)})}function At(){const e=document.getElementById("stockModal"),t=e==null?void 0:e.querySelector(".modal-close");t&&t.addEventListener("click",()=>e.classList.remove("active")),e==null||e.addEventListener("click",o=>{o.target===e&&e.classList.remove("active")}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(e!=null&&e.classList.contains("active"))&&e.classList.remove("active")})}document.addEventListener("click",e=>{const t=e.target.closest(".stock-favorite-btn");if(t){e.preventDefault(),e.stopPropagation(),ae(t.dataset.favoriteSymbol);return}const o=e.target.closest(".stock-chart-link");if(!o)return;const a=o.dataset.chartSymbol,n=D().find(l=>l.symbol===a);if(!n)return;const s=ht(n);if(s){window.open(s,"_blank","noopener,noreferrer");return}We(n)});function Z(e){return m.favorites.includes(e)}function ae(e){e&&(Z(e)?m.favorites=m.favorites.filter(t=>t!==e):m.favorites=[...m.favorites,e],se("favorites",m.favorites),I())}async function We(e){var g,u,v,y,h;const t=document.getElementById("stockModal");e.symbol.includes(".KS")||e.symbol.includes(".KQ");const o=e.symbol.replace(".KS","").replace(".KQ",""),a=`${e.name} (${o})`,n=e.currency==="KRW"?"₩":"$",s=e.dailyChangePercent??e.changePercent??0,l=e.monthlyChangePercent??null,r=s===0?"neutral":s>0?"up":"down",c=s===0?"":s>0?"▲":"▼";document.getElementById("modalTitle").textContent=a,document.getElementById("modalPrice").textContent=`${n}${(g=e.price)==null?void 0:g.toLocaleString()}`,document.getElementById("modalPrice").className=`modal-price ${r}`;const d=document.getElementById("modalChangeBadge");d&&(d.textContent=`${c?`${c} `:""}${Math.abs(s).toFixed(2)}%`,d.className=`modal-change-badge ${r}`),document.getElementById("modalChange").innerHTML=`${c?`${c} `:""}${Math.abs(s).toFixed(2)}%`,document.getElementById("modalPrevClose").textContent=e.previousClose?`${n}${(u=e.previousClose)==null?void 0:u.toLocaleString()}`:"-";const f=document.getElementById("modalPrevDate");if(f){const p=new Date,b=new Date(p),S=p.getDay();S===1?b.setDate(p.getDate()-3):S===0?b.setDate(p.getDate()-2):b.setDate(p.getDate()-1);const E=b.getMonth()+1,w=b.getDate();f.textContent=`(${E}/${w})`}document.getElementById("modalHigh52").textContent=`${n}${((v=e.high52)==null?void 0:v.toLocaleString())||"0"}`,document.getElementById("modalLow52").textContent=`${n}${((y=e.low52)==null?void 0:y.toLocaleString())||"0"}`;const i=document.getElementById("modalMonthly");i&&l!==null&&(i.textContent=`${l>=0?"▲":"▼"} ${Math.abs(l).toFixed(2)}%`,i.className=`modal-metric-value ${l>=0?"up":"down"}`),t.classList.add("active");try{const p=await tt(e.symbol);(h=p.data)!=null&&h.length&&rt("modalChart",p.data,e.name)}catch{console.warn("차트 로드 실패")}}function xt(){var o,a;(o=document.getElementById("btnRefresh"))==null||o.addEventListener("click",async()=>{const n=document.getElementById("btnRefresh");n.classList.add("spinning"),nt(),await Y(),n.classList.remove("spinning")}),(a=document.getElementById("btnCollect"))==null||a.addEventListener("click",async()=>{const n=document.getElementById("btnCollect");n.disabled=!0,n.textContent="⏳ 수집 중...";try{await ze(),await Y()}catch(s){console.error("수집 실패:",s),alert(s.message||"수집에 실패했습니다.")}finally{n.disabled=!1,n.textContent="↓ 수집"}});const e=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",e);const t=document.getElementById("btnThemeToggle");t&&(t.textContent=e==="dark"?"☀️":"🌙",t.addEventListener("click",()=>{const s=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("theme",s),t.textContent=s==="dark"?"☀️":"🌙"}))}function Pt(){const e=document.getElementById("lastUpdate");e&&(e.textContent=`마지막 새로고침: ${new Date().toLocaleTimeString("ko-KR")}`)}async function Ft(){var t;const e=document.getElementById("dataDate");if(e)try{const o=await Xe();if((t=o.data)!=null&&t.lastCollectedAt){const a=new Date(o.data.lastCollectedAt),n=a.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit"}),s=a.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});e.textContent=`📅 데이터 기준: ${n} ${s}`,e.title=`마지막 데이터 수집: ${a.toLocaleString("ko-KR")}`}else e.textContent="📅 데이터 수집 대기 중..."}catch{e.textContent="📅 수집 정보 없음"}}function Ee(e){const t=document.getElementById("loadingSpinner");t&&(t.style.display=e?"block":"none")}async function qt(){await Y()}function Kt(){var s;const e=document.getElementById("btnAddCustomStock"),t=document.getElementById("addStockModal"),o=document.getElementById("addStockModalClose"),a=document.getElementById("btnSubmitCustom"),n=document.getElementById("btnCancelCustom");e==null||e.addEventListener("click",()=>{var l;t.classList.add("active"),de(),(l=document.getElementById("customSymbol"))==null||l.focus()}),o==null||o.addEventListener("click",()=>t.classList.remove("active")),n==null||n.addEventListener("click",()=>t.classList.remove("active")),t==null||t.addEventListener("click",l=>{l.target===t&&t.classList.remove("active")}),document.addEventListener("keydown",l=>{l.key==="Escape"&&(t!=null&&t.classList.contains("active"))&&t.classList.remove("active")}),a==null||a.addEventListener("click",ke),(s=document.getElementById("customSymbol"))==null||s.addEventListener("keydown",l=>{l.key==="Enter"&&ke()})}async function ke(){const e=document.getElementById("customSymbol"),t=document.getElementById("customName"),o=document.getElementById("customMarket"),a=document.getElementById("customStockMessage"),n=document.getElementById("btnSubmitCustom"),s=e==null?void 0:e.value.trim(),l=t==null?void 0:t.value.trim(),r=o==null?void 0:o.value;if(!s){j(a,"심볼을 입력해주세요.","error"),e==null||e.focus();return}n.disabled=!0,n.textContent="추가 중...";try{const c=await et(s,l,r);c.success?(j(a,`✅ ${c.data.name} (${c.data.symbol}) 추가 완료!`,"success"),e.value="",t.value="",de(),setTimeout(async()=>{const d=await O().catch(()=>({data:[]}));m.custom=d.data||[],I(),ie()},500)):j(a,`❌ ${c.error||"추가 실패"}`,"error")}catch(c){j(a,`❌ ${c.message||"서버 오류"}`,"error")}finally{n.disabled=!1,n.textContent="추가하기"}}function j(e,t,o){e&&(e.textContent=t,e.className=`form-message ${o}`,setTimeout(()=>{e.className="form-message",e.textContent=""},4e3))}async function de(){const e=document.getElementById("customStocksList");if(e)try{const o=(await O()).data||[];if(o.length===0){e.innerHTML='<p class="custom-empty">아직 추가한 종목이 없습니다.</p>';return}e.innerHTML=o.map(a=>{var n;return`
            <div class="custom-stock-item">
                <div class="custom-stock-info">
                    <span class="custom-stock-symbol">${a.symbol}</span>
                    <span class="custom-stock-name">${a.name||a.symbol} · ${a.currency==="KRW"?"₩":"$"}${((n=a.price)==null?void 0:n.toLocaleString())||"-"}</span>
                </div>
                <button class="btn-remove-custom" data-symbol="${a.symbol}">삭제</button>
            </div>
        `}).join(""),e.querySelectorAll(".btn-remove-custom").forEach(a=>{a.addEventListener("click",async()=>{const n=a.dataset.symbol;if(confirm(`${n} 종목을 삭제하시겠습니까?`))try{await Je(n),de();const s=await O().catch(()=>({data:[]}));m.custom=s.data||[],I(),ie()}catch(s){alert("삭제 실패: "+s.message)}})})}catch{e.innerHTML='<p class="custom-empty">목록 로드 실패</p>'}}let C=1350,B=null;function Tt(){const e=document.getElementById("btnConfirmAdd"),t=document.getElementById("btnCancelAdd"),o=document.getElementById("btnOpenPortfolioAdd"),a=document.querySelectorAll("[data-cash-toggle]"),n=document.getElementById("portfolioAddForm"),s=document.getElementById("addStockSelect");o==null||o.addEventListener("click",()=>{B=null,X(),Ue(),n.style.display=n.style.display==="block"?"none":"block",n.style.display==="block"&&n.scrollIntoView({behavior:"smooth",block:"center"})}),t==null||t.addEventListener("click",()=>{n.style.display="none",B=null,X()}),e==null||e.addEventListener("click",()=>Rt()),a.forEach(l=>{l.addEventListener("click",()=>{const r=l.dataset.cashToggle==="include";_!==r&&(_=r,Ce(),R())})}),Ce(),s==null||s.addEventListener("change",()=>{const l=s.value;if(!l)return;const[r,c]=l.split("|");if(r==="USD-CASH"||c==="cash_usd"){document.getElementById("addStockInput").value="USD",document.getElementById("addStockName").value="달러 현금",document.getElementById("addStockBuyPrice").value=C?Math.round(C):"",document.getElementById("addStockMarket").value="cash_usd";return}const f=D().find(i=>i.symbol===r);f&&(document.getElementById("addStockInput").value=f.symbol,document.getElementById("addStockName").value=f.name,document.getElementById("addStockBuyPrice").value=f.price||"",document.getElementById("addStockMarket").value=f.currency==="KRW"?"korean":"overseas")}),Dt()}async function Dt(){var e;try{const t=await Le();He((e=t.data)==null?void 0:e.usdKrw)}catch{}}function He(e){if(!e)return;C=e;const t=document.getElementById("pfExchangeRate");t&&(t.textContent=`₩${Math.round(C).toLocaleString()}`),U==="portfolio"&&R()}function Ue(){const e=document.getElementById("addStockSelect");if(!e)return;const t=D();e.innerHTML='<option value="">-- 기존 종목에서 선택 --</option>';const o=document.createElement("option");o.value="USD-CASH|cash_usd",o.textContent=`달러 현금 (USD) - ₩${Math.round(C).toLocaleString()}`,e.appendChild(o),t.forEach(a=>{var l;const n=document.createElement("option");n.value=`${a.symbol}|${a.currency==="KRW"?"korean":"overseas"}`;const s=a.currency==="KRW"?"₩":"$";n.textContent=`${a.name} (${a.symbol}) - ${s}${(l=a.price)==null?void 0:l.toLocaleString()}`,e.appendChild(n)})}function X(){["addStockInput","addStockName","addStockBuyPrice"].forEach(r=>{const c=document.getElementById(r);c&&(c.value="")});const t=document.getElementById("addStockQty");t&&(t.value="1");const o=document.getElementById("addStockBuyDate");o&&(o.value=ce());const a=document.getElementById("addStockSelect");a&&(a.value="");const n=document.getElementById("addStockMarket");n&&(n.value="overseas");const s=document.getElementById("addStockInput");s&&(s.disabled=!1);const l=document.getElementById("addStockSelect");l&&(l.disabled=!1)}async function Rt(){const e=document.getElementById("addStockInput"),t=document.getElementById("addStockName"),o=document.getElementById("addStockQty"),a=document.getElementById("addStockBuyPrice"),n=document.getElementById("addStockBuyDate"),s=document.getElementById("addStockMarket"),l=document.getElementById("portfolioAddForm"),c=((e==null?void 0:e.value.trim())||"").toUpperCase();t!=null&&t.value.trim();const d=parseFloat(o==null?void 0:o.value)||1,f=parseFloat(a==null?void 0:a.value)||0,i=(n==null?void 0:n.value)||ce(),u=["USD","USD-CASH","달러","달러현금"].includes(c)?"cash_usd":(s==null?void 0:s.value)||"overseas",v=u==="cash_usd";if(!c&&!v){e==null||e.focus();return}const y=v?"USD-CASH":c,h=v?(t==null?void 0:t.value.trim())||"달러 현금":(t==null?void 0:t.value.trim())||c,p={id:B||Me(),symbol:y,name:h,market:u,qty:d,buyPrice:f,buyDate:i,currency:u==="korean"?"KRW":"USD",addedAt:new Date().toISOString()};B?m.portfolio=m.portfolio.map(b=>b.id===B?{...b,...p,editedAt:new Date().toISOString()}:b):m.portfolio.push(p),Ve(),l.style.display="none",B=null,X(),R()}function Nt(e){var f;const t=m.portfolio.find(i=>i.id===e),o=document.getElementById("portfolioAddForm");if(!t||!o)return;B=e,Ue();const a=document.getElementById("addStockInput"),n=document.getElementById("addStockName"),s=document.getElementById("addStockQty"),l=document.getElementById("addStockBuyPrice"),r=document.getElementById("addStockBuyDate"),c=document.getElementById("addStockMarket"),d=document.getElementById("addStockSelect");a&&(a.value=t.symbol==="USD-CASH"?"USD":t.symbol,a.disabled=!0),n&&(n.value=t.name||""),s&&(s.value=t.qty??1),l&&(l.value=t.buyPrice??""),r&&(r.value=t.buyDate||((f=t.addedAt)==null?void 0:f.slice(0,10))||ce()),c&&(c.value=t.market||"overseas"),d&&(d.value="",d.disabled=!0),o.style.display="block",o.scrollIntoView({behavior:"smooth",block:"center"})}function Wt(e){m.portfolio=m.portfolio.filter(t=>t.id!==e),B===e&&(B=null,X()),Ve(),R()}function Ve(){se("portfolio",Ae(m.portfolio))}function R(){const e=document.getElementById("portfolioStocks");if(!e)return;if(m.portfolio.length===0){e.innerHTML=`
            <div class="portfolio-empty">
                <span class="portfolio-empty-icon">📂</span>
                <p>포트폴리오가 비어 있습니다.</p>
            </div>`,ee([]),te(0,0);return}e.innerHTML="";const t=D();let o=0,a=0;const n=[],s=document.createElement("section");s.className="pf-holdings-section",s.innerHTML=`
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
        </div>`;const d=m.portfolio.filter(i=>{const g=oe(i,t);return Ut(g)});if(!d.length){e.innerHTML=`
            <div class="portfolio-empty">
                <span class="portfolio-empty-icon">🧩</span>
                <p>선택한 구성 비율에 해당하는 종목이 없습니다.</p>
            </div>`,ee(we(t)),te(o,a);return}const f=new Map;d.forEach(i=>{const g=oe(i,t),{qty:u,buyPrice:v,isUsdCash:y,isKRW:h,currentPrice:p,evalTotalKRW:b,investedKRW:S,gainKRW:E,gainPct:w,includeInSummary:M,liveData:k}=g,L=h?"₩":"$",A=`${i.symbol}__${i.market||""}`,ue=u>0?b/u:0,F=y?0:k?k.dailyChangePercent??k.changePercent??0:0,q=F===0?"neutral":F>0?"up":"down",me=F===0?"":F>0?"▲":"▼";M&&(o+=b,a+=S);const J=E>=0?"up":"down",ye=E>=0?"▲":"▼",N=document.createElement("div");N.className=`pf-table-row ${q}`,N.dataset.portfolioId=i.id,N.dataset.symbol=i.symbol,N.innerHTML=`
            <div class="pf-col-name">
                <div class="pf-stock-info">
                    <span class="pf-stock-name">${i.name||(k==null?void 0:k.name)||i.symbol}</span>
                    <span class="pf-stock-symbol">${y?"USD 현금":i.symbol.replace(".KS","").replace(".KQ","")}</span>
                </div>
            </div>
            <div class="pf-col-price">
                <span class="pf-current-price">${y?`₩${Math.round(C).toLocaleString()}`:p?`${L}${p.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:"-"}</span>
                <span class="pf-daily-change ${q}">${y?"환율 기준 평가":`${me?`${me} `:""}${Math.abs(F).toFixed(2)}%`}</span>
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
                    <span class="pf-gain-amount ${J}">${ye} ₩${Math.abs(Math.round(E)).toLocaleString()}</span>
                    <span class="pf-gain-pct ${J}">${ye} ${Math.abs(w).toFixed(2)}%</span>
                `:'<span class="pf-no-data">-</span>'}
            </div>
            <div class="pf-col-action">
                <button class="btn-edit-stock" data-portfolio-id="${i.id}" title="수정">수정</button>
                <button class="btn-remove-stock" data-portfolio-id="${i.id}" data-symbol="${i.symbol}" title="삭제">×</button>
            </div>
        `,c.appendChild(N),f.has(A)||f.set(A,{key:A,symbol:i.symbol,name:i.name||(k==null?void 0:k.name)||i.symbol,market:i.market,isUsdCash:y,isKRW:h,currencySymbol:L,currentPrice:p,currentUnitValueKRW:ue,totalQty:0,totalEvalKRW:0,totalInvestedKRW:0,totalBuyValue:0,dailyPct:F,dailyDirection:q});const x=f.get(A);x.totalQty+=u,x.totalEvalKRW+=b,x.totalInvestedKRW+=S,x.totalBuyValue+=v*u,x.currentPrice=p,x.currentUnitValueKRW=ue,x.dailyPct=F,x.dailyDirection=q}),f.forEach(i=>n.push(i)),n.sort((i,g)=>g.totalEvalKRW-i.totalEvalKRW).forEach(i=>{const g=i.totalQty>0?i.totalBuyValue/i.totalQty:0,u=i.totalEvalKRW-i.totalInvestedKRW,v=i.totalInvestedKRW>0?u/i.totalInvestedKRW*100:0,y=u>=0?"up":"down",h=u>=0?"▲":"▼",p=i.dailyPct===0?"":i.dailyPct>0?"▲":"▼",b=i.isUsdCash?"USD 현금":i.symbol.replace(".KS","").replace(".KQ",""),S=document.createElement("div");S.className="pf-summary-table-row",S.innerHTML=`
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
            `,l.appendChild(S)}),s.appendChild(l),r.appendChild(c),e.appendChild(s),e.appendChild(r),ee(we(t)),te(o,a),e.querySelectorAll(".btn-edit-stock").forEach(i=>{i.addEventListener("click",g=>{g.stopPropagation(),Nt(i.dataset.portfolioId)})}),e.querySelectorAll(".btn-remove-stock").forEach(i=>{i.addEventListener("click",g=>{g.stopPropagation();const u=i.dataset.symbol,v=i.dataset.portfolioId;confirm(`${u}을(를) 포트폴리오에서 삭제하시겠습니까?`)&&Wt(v)})}),e.querySelectorAll(".pf-table-row").forEach(i=>{i.addEventListener("click",g=>{if(g.target.closest(".btn-remove-stock")||g.target.closest(".btn-edit-stock"))return;const u=i.dataset.symbol,v=i.dataset.portfolioId,y=m.portfolio.find(p=>p.id===v);if((y==null?void 0:y.market)==="cash_usd"||u==="USD-CASH")return;const h=t.find(p=>p.symbol===u);h&&We(h)})})}function oe(e,t){const o=t.find(p=>p.symbol===e.symbol),a=e.qty||1,n=e.buyPrice||0,s=e.market==="cash_usd"||e.symbol==="USD-CASH",l=e.market==="cash_krw"||e.symbol==="KRW-CASH",r=l||e.currency==="KRW"||e.market==="korean",c=Ht(e,o,s,l),d=(o==null?void 0:o.price)||0,i=(s?C:r?l?1:d:d*C)*a,u=(s||r?n:n*C)*a,v=n>0?i-u:0,y=n>0?s?(C-n)/n*100:(d-n)/n*100:0;return{liveData:o,qty:a,buyPrice:n,isUsdCash:s,isKrwCash:l,isKRW:r,categoryKey:c,currentPrice:d,evalTotalKRW:i,investedKRW:u,gainKRW:v,gainPct:y,includeInSummary:_||!s&&!l}}function Ht(e,t,o,a){const n=["etf_us","etf_kr"].includes(t==null?void 0:t.theme)||e.market==="etf",s=(t==null?void 0:t.theme)==="crypto"||e.market==="crypto",l=!n&&!s&&(e.market==="korean"||(t==null?void 0:t.currency)==="KRW");return o||a?"cash":s?"crypto":n?"etf":l?"korean":"overseas"}function Ut(e){return T==="all"?!0:e.categoryKey===T}function we(e){const t=new Map([["korean",{key:"korean",label:"국내주식",color:"#61db9c",value:0,invested:0}],["overseas",{key:"overseas",label:"해외주식",color:"#a896ff",value:0,invested:0}],["etf",{key:"etf",label:"ETF",color:"#66dbff",value:0,invested:0}],["crypto",{key:"crypto",label:"코인",color:"#ff9a51",value:0,invested:0}],["cash",{key:"cash",label:"원화/현금",color:"#c8ff3d",value:0,invested:0}]]);return m.portfolio.forEach(a=>{const{categoryKey:n,evalTotalKRW:s,investedKRW:l}=oe(a,e);n==="cash"?(t.get("cash").value+=s,t.get("cash").invested+=l):n==="crypto"?(t.get("crypto").value+=s,t.get("crypto").invested+=l):n==="etf"?(t.get("etf").value+=s,t.get("etf").invested+=l):n==="korean"?(t.get("korean").value+=s,t.get("korean").invested+=l):(t.get("overseas").value+=s,t.get("overseas").invested+=l)}),Array.from(t.entries()).filter(([a,n])=>n.value>0&&(_||a!=="cash")).map(([,a])=>({...a,gain:a.value-a.invested})).sort((a,n)=>n.value-a.value)}function ee(e){const t=document.getElementById("pfAllocationLegend");if(!t)return;const o=e.reduce((a,n)=>a+n.value,0)||1;if(lt("pfAllocationChart",e,{activeKey:T,onSliceClick:Ie}),!e.length){t.innerHTML='<div class="custom-empty">구성 비율을 표시할 자산이 없습니다.</div>';return}t.innerHTML=e.map(a=>{const n=a.value/o*100,s=a.gain>=0?"up":"down",l=a.gain>=0?"▲":"▼";return`
            <button class="pf-allocation-item ${T===a.key?"active":""}" type="button" data-allocation-key="${a.key}">
                <span class="pf-allocation-dot" style="background:${a.color}"></span>
                <span class="pf-allocation-name">${a.label}</span>
                <div class="pf-allocation-meta">
                    <span class="pf-allocation-value">₩${Math.round(a.value).toLocaleString()}</span>
                    <span class="pf-allocation-pct">${n.toFixed(1)}%</span>
                    <span class="pf-allocation-gain ${s}">${l} ₩${Math.abs(Math.round(a.gain)).toLocaleString()}</span>
                </div>
            </button>
        `}).join(""),t.querySelectorAll("[data-allocation-key]").forEach(a=>{a.addEventListener("click",()=>{Ie(a.dataset.allocationKey)})})}function te(e,t){const o=document.getElementById("pfTotalKRW"),a=document.getElementById("pfTotalInvested"),n=document.getElementById("pfTotalGain"),s=document.getElementById("pfTotalGainPct");o&&(o.textContent=`₩${Math.round(e).toLocaleString()}`),a&&(a.textContent=`₩${Math.round(t).toLocaleString()}`);const l=e-t,r=t>0?l/t*100:0,c=l>=0?"up":"down",d=l>=0?"▲":"▼";n&&(n.textContent=`${d} ₩${Math.abs(Math.round(l)).toLocaleString()}`,n.className=`pf-summary-value ${c}`),s&&(s.textContent=`${d} ${Math.abs(r).toFixed(2)}%`,s.className=`pf-summary-sub ${c}`)}function Ce(){document.querySelectorAll("[data-cash-toggle]").forEach(e=>{const t=e.dataset.cashToggle==="include"===_;e.classList.toggle("active",t),e.setAttribute("aria-pressed",t?"true":"false")})}function Ie(e){T=T===e?"all":e,R()}export{_t as initDashboard,qt as refreshData};
