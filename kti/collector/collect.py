"""한반도 긴장도 지수(KTI) 수집·계산 스크립트.

GitHub Actions에서 매일 실행됨. 외부 소스별로 원본을 kti/data/raw/ 에 누적 저장하고,
주 단위 지수를 계산해 kti/data/kti.json 으로 내보냄.

소스
- GDELT DOC 2.0 API: 북한 관련 기사 비중(군사·위협·대응 키워드), 평균 논조
- FRED: 원/달러(DEXKOUS), 달러인덱스(DTWEXBGS)
- Yahoo Finance(yfinance): KOSPI, 방산 4종
- Wikimedia Pageviews: 한국어 위키백과 조회수
- 수동 큐레이션: kti/data/events.csv (북한 군사 이벤트), schedule.csv
"""
from __future__ import annotations

import json
import math
import sys
import time
import traceback
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote

import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw"
RAW.mkdir(parents=True, exist_ok=True)

START = date(2023, 1, 1)
TODAY = datetime.now(timezone.utc).date()
UA = {"User-Agent": "DataLearners-KTI/1.0 (https://www.data-learners.com/kti/; heoquixote@gmail.com)"}
STATUS: dict[str, dict] = {}

GDELT_QUERIES = {
    "military": '"north korea" (missile OR artillery OR ballistic OR "military demarcation")',
    "threat": '"north korea" (threatens OR warns OR "kim yo jong" OR "nuclear attack")',
    "response": '"north korea" ("joint drills" OR "military exercise" OR "aircraft carrier" OR "strategic bomber")',
}
GDELT_TONE_QUERY = '"north korea"'
PAGEVIEW_ARTICLES = ["북한", "전쟁", "민방위", "한국_전쟁", "핵무기"]
TICKERS = {"^KS11": "KOSPI", "012450.KS": "한화에어로스페이스", "079550.KS": "LIG넥스원",
           "064350.KS": "현대로템", "047810.KS": "한국항공우주"}
STAGE_W = {"S1": 1, "S2": 3, "S3": 5, "S4": 8, "S5": 12, "S6": 20}
WEIGHTS = {"military": 0.30, "statement": 0.25, "response": 0.20, "finance": 0.15, "attention": 0.10}
DOMAIN_KO = {"military": "북한 군사 행동", "statement": "북한 위협·논조", "response": "한미일 대응",
             "finance": "금융 시장", "attention": "국내 관심도"}


def log(*a):
    print(*a, flush=True)


def merge_store(path: Path, new: pd.DataFrame, keys: list[str]) -> pd.DataFrame:
    if path.exists():
        old = pd.read_csv(path, dtype={k: str for k in keys})
        df = pd.concat([old, new], ignore_index=True)
    else:
        df = new
    df = df.drop_duplicates(subset=keys, keep="last").sort_values(keys).reset_index(drop=True)
    df.to_csv(path, index=False)
    return df


def last_date(path: Path, col: str = "date") -> date | None:
    if not path.exists():
        return None
    s = pd.read_csv(path, usecols=[col], dtype=str)[col]
    return None if s.empty else datetime.strptime(s.max(), "%Y-%m-%d").date()


def chunks(start: date, end: date, days: int):
    cur = start
    while cur <= end:
        nxt = min(end, cur + timedelta(days=days - 1))
        yield cur, nxt
        cur = nxt + timedelta(days=1)


# ---------------------------------------------------------------- GDELT
def gdelt_call(query: str, mode: str, s: date, e: date) -> list[dict]:
    params = {"query": query, "mode": mode, "format": "json",
              "startdatetime": s.strftime("%Y%m%d") + "000000",
              "enddatetime": e.strftime("%Y%m%d") + "235959"}
    for attempt in range(4):
        r = requests.get("https://api.gdeltproject.org/api/v2/doc/doc", params=params, headers=UA, timeout=60)
        if r.status_code == 429 or not r.text.strip().startswith("{"):
            time.sleep(10 * (attempt + 1))
            continue
        r.raise_for_status()
        tl = r.json().get("timeline", [])
        return tl[0]["data"] if tl else []
    raise RuntimeError(f"GDELT 응답 실패: {r.status_code} {r.text[:120]}")


def fetch_gdelt():
    for key, q in list(GDELT_QUERIES.items()) + [("tone", GDELT_TONE_QUERY)]:
        path = RAW / f"gdelt_{key}.csv"
        name = f"gdelt_{key}"
        try:
            ld = last_date(path)
            start = START if ld is None else ld - timedelta(days=10)
            rows = []
            for s, e in chunks(start, TODAY, 60):
                mode = "timelinetone" if key == "tone" else "timelinevolraw"
                data = gdelt_call(q, mode, s, e)
                for d in data:
                    day = datetime.strptime(d["date"][:8], "%Y%m%d").date().isoformat()
                    rows.append({"date": day, "value": d.get("value"), "norm": d.get("norm")})
                time.sleep(6)
            if rows:
                df = pd.DataFrame(rows)
                if key == "tone":
                    df = df.groupby("date", as_index=False)["value"].mean()
                else:
                    df = df.groupby("date", as_index=False)[["value", "norm"]].sum()
                df = merge_store(path, df, ["date"])
            STATUS[name] = {"ok": True, "last": str(last_date(path)), "label": f"GDELT 기사 {key}"}
            log("gdelt", key, "rows", len(rows))
        except Exception as ex:  # noqa: BLE001
            STATUS[name] = {"ok": False, "last": str(last_date(path)), "error": str(ex)[:200], "label": f"GDELT 기사 {key}"}
            log("gdelt fail", key, ex)


# ---------------------------------------------------------------- FRED
def fetch_fred():
    path = RAW / "fred.csv"
    try:
        frames = []
        for sid in ["DEXKOUS", "DTWEXBGS"]:
            url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}&cosd=2022-01-01"
            r = requests.get(url, headers=UA, timeout=60)
            r.raise_for_status()
            from io import StringIO
            df = pd.read_csv(StringIO(r.text))
            df.columns = ["date", "value"]
            df["series"] = sid
            df["value"] = pd.to_numeric(df["value"], errors="coerce")
            frames.append(df.dropna())
        merge_store(path, pd.concat(frames), ["date", "series"])
        STATUS["fred"] = {"ok": True, "last": str(last_date(path)), "label": "FRED 환율·달러지수"}
    except Exception as ex:  # noqa: BLE001
        STATUS["fred"] = {"ok": False, "last": str(last_date(path)), "error": str(ex)[:200], "label": "FRED 환율·달러지수"}
        log("fred fail", ex)


# ---------------------------------------------------------------- Yahoo
def fetch_yahoo():
    path = RAW / "yahoo.csv"
    try:
        import yfinance as yf
        df = yf.download(list(TICKERS), start="2022-01-01", auto_adjust=True, progress=False, threads=False)["Close"]
        long = df.reset_index().melt(id_vars="Date", var_name="ticker", value_name="close").dropna()
        long["date"] = pd.to_datetime(long["Date"]).dt.strftime("%Y-%m-%d")
        long = long[["date", "ticker", "close"]]
        if long.empty:
            raise RuntimeError("빈 응답")
        merge_store(path, long, ["date", "ticker"])
        STATUS["yahoo"] = {"ok": True, "last": str(last_date(path)), "label": "Yahoo Finance KOSPI·방산주"}
    except Exception as ex:  # noqa: BLE001
        STATUS["yahoo"] = {"ok": False, "last": str(last_date(path)), "error": str(ex)[:200], "label": "Yahoo Finance KOSPI·방산주"}
        log("yahoo fail", ex)


# ---------------------------------------------------------------- Pageviews
def fetch_pageviews():
    path = RAW / "pageviews.csv"
    try:
        ld = last_date(path)
        start = START if ld is None else ld - timedelta(days=7)
        rows, okc = [], 0
        for art in PAGEVIEW_ARTICLES:
            url = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/ko.wikipedia.org/all-access/user/"
                   f"{quote(art, safe='')}/daily/{start:%Y%m%d}00/{TODAY:%Y%m%d}00")
            r = requests.get(url, headers=UA, timeout=60)
            if r.status_code == 404:
                log("pageviews 404", art)
                continue
            r.raise_for_status()
            okc += 1
            for it in r.json().get("items", []):
                rows.append({"date": f"{it['timestamp'][:4]}-{it['timestamp'][4:6]}-{it['timestamp'][6:8]}",
                             "article": art, "views": it["views"]})
            time.sleep(1)
        if not okc:
            raise RuntimeError("조회 가능한 문서 없음")
        merge_store(path, pd.DataFrame(rows), ["date", "article"])
        STATUS["pageviews"] = {"ok": True, "last": str(last_date(path)), "label": "위키백과 조회수"}
    except Exception as ex:  # noqa: BLE001
        STATUS["pageviews"] = {"ok": False, "last": str(last_date(path)), "error": str(ex)[:200], "label": "위키백과 조회수"}
        log("pageviews fail", ex)


# ---------------------------------------------------------------- 계산
def week_start(d: pd.Series) -> pd.Series:
    d = pd.to_datetime(d)
    return (d - pd.to_timedelta(d.dt.weekday, unit="D")).dt.normalize()


def robust_z(s: pd.Series) -> tuple[pd.Series, pd.Series]:
    """주 단위 시리즈의 이상 점수.

    전년도 같은 시기(±2주, 최대 3년) 표본이 8개 이상이면 계절 기준선,
    아니면 직전 52주(최근 4주 제외) 기준선을 쓰는 robust z (중앙값, MAD).
    """
    s = s.dropna()
    out, kind = {}, {}
    idx = list(s.index)
    for t in idx:
        woy = t.isocalendar().week
        seas = [v for u, v in s.items()
                if u < t - pd.Timedelta(weeks=26) and u >= t - pd.Timedelta(weeks=160)
                and min(abs(u.isocalendar().week - woy), 53 - abs(u.isocalendar().week - woy)) <= 2]
        if len(seas) >= 8:
            ref, k = np.array(seas), "seasonal"
        else:
            ref = s[(s.index < t - pd.Timedelta(weeks=4)) & (s.index >= t - pd.Timedelta(weeks=56))].values
            k = "trailing"
        if len(ref) < 12 and k == "trailing":
            continue
        med = np.median(ref)
        mad = np.median(np.abs(ref - med)) * 1.4826
        sd = max(mad, np.std(ref) * 0.5, 1e-9)
        out[t] = float(np.clip((s[t] - med) / sd, -5, 5))
        kind[t] = k
    return pd.Series(out, dtype=float), pd.Series(kind, dtype=object)


def load(path: Path) -> pd.DataFrame | None:
    return pd.read_csv(path) if path.exists() else None


def compute():
    weekly = pd.DataFrame()
    daily_media, daily_fin, daily_att = None, None, None

    # GDELT 비중
    for key in GDELT_QUERIES:
        df = load(RAW / f"gdelt_{key}.csv")
        if df is None or df.empty:
            continue
        df["week"] = week_start(df["date"])
        w = df.groupby("week").agg(v=("value", "sum"), n=("norm", "sum"))
        weekly[f"share_{key}"] = w["v"] / w["n"].replace(0, np.nan) * 1e4  # 만 건당
        d = df.assign(share=df["value"] / df["norm"].replace(0, np.nan) * 1e4)[["date", "share"]].rename(columns={"share": key})
        daily_media = d if daily_media is None else daily_media.merge(d, on="date", how="outer")
    tone = load(RAW / "gdelt_tone.csv")
    if tone is not None and not tone.empty:
        tone["week"] = week_start(tone["date"])
        weekly["tone"] = tone.groupby("week")["value"].mean()

    # 금융
    fred, yh = load(RAW / "fred.csv"), load(RAW / "yahoo.csv")
    if fred is not None and not fred.empty:
        fx = fred.pivot_table(index="date", columns="series", values="value").sort_index()
        fx.index = pd.to_datetime(fx.index)
        fx = fx.ffill().dropna()
        r = np.log(fx).diff().dropna()
        cov = r.rolling(250, min_periods=60).cov().unstack()["DEXKOUS"]["DTWEXBGS"]
        var = r["DTWEXBGS"].rolling(250, min_periods=60).var()
        beta = (cov / var).shift(1).fillna(1.0)
        ex = r["DEXKOUS"] - beta * r["DTWEXBGS"]
        w = ex.groupby(week_start(pd.Series(ex.index)).values).sum()
        weekly["krw_excess"] = w * 100
        fin = pd.DataFrame({"date": fx.index.strftime("%Y-%m-%d"), "krw": fx["DEXKOUS"].values})
        fin = fin.merge(pd.DataFrame({"date": ex.index.strftime("%Y-%m-%d"), "krw_ex": (ex * 100).values}), on="date", how="left")
        daily_fin = fin
    if yh is not None and not yh.empty:
        px = yh.pivot_table(index="date", columns="ticker", values="close").sort_index()
        px.index = pd.to_datetime(px.index)
        rets = np.log(px).diff()
        if "^KS11" in rets:
            k = rets["^KS11"].dropna()
            wk = week_start(pd.Series(k.index)).values
            weekly["kospi_vol"] = k.groupby(wk).std() * math.sqrt(252) * 100
            defs = [c for c in TICKERS if c != "^KS11" and c in rets]
            if defs:
                dex = rets[defs].mean(axis=1) - rets["^KS11"]
                dex = dex.dropna()
                weekly["defense_excess"] = dex.groupby(week_start(pd.Series(dex.index)).values).sum() * 100
                rel = (np.exp(dex.cumsum()) * 100)
            yfin = pd.DataFrame({"date": px.index.strftime("%Y-%m-%d"), "kospi": px["^KS11"].values})
            if defs:
                yfin = yfin.merge(pd.DataFrame({"date": rel.index.strftime("%Y-%m-%d"), "defense_rel": rel.values}), on="date", how="left")
            daily_fin = yfin if daily_fin is None else daily_fin.merge(yfin, on="date", how="outer")

    # 관심도
    pv = load(RAW / "pageviews.csv")
    if pv is not None and not pv.empty:
        tot = pv.groupby("date", as_index=False)["views"].sum()
        tot["week"] = week_start(tot["date"])
        weekly["views"] = tot.groupby("week")["views"].mean()  # 일평균 (진행 중인 주 왜곡 방지)
        daily_att = pv.pivot_table(index="date", columns="article", values="views", aggfunc="sum").reset_index()

    # 이벤트
    ev = pd.read_csv(DATA / "events.csv", dtype=str).fillna("")
    ev["weight"] = ev["stage"].map(STAGE_W).fillna(1).astype(int)
    q = pd.to_numeric(ev["qty"], errors="coerce")
    ev["score"] = ev["weight"] * np.sqrt(q.fillna(2).clip(lower=1))
    ev["week"] = week_start(ev["date"])
    weekly["event_score"] = ev.groupby("week")["score"].sum()
    weekly["max_stage_w"] = ev.groupby("week")["weight"].max()

    weekly = weekly.sort_index()
    weekly = weekly[(weekly.index >= pd.Timestamp(START)) & (weekly.index <= pd.Timestamp(TODAY))]
    full_idx = pd.date_range(weekly.index.min(), pd.Timestamp(TODAY) - pd.Timedelta(days=TODAY.weekday()), freq="W-MON")
    weekly = weekly.reindex(full_idx)
    weekly["event_score"] = weekly["event_score"].fillna(0)
    weekly["max_stage_w"] = weekly["max_stage_w"].fillna(0)

    # 영역별 z
    def zc(col, sign=1.0, transform=None):
        if col not in weekly or weekly[col].dropna().empty:
            return pd.Series(dtype=float)
        s = weekly[col] * sign
        if transform:
            s = transform(s)
        return robust_z(s)[0]

    z = pd.DataFrame(index=weekly.index)
    z["military"] = zc("share_military")
    z["statement"] = pd.concat([zc("share_threat"), zc("tone", -1.0)], axis=1).mean(axis=1)
    z["response"] = zc("share_response")
    z["finance"] = pd.concat([zc("krw_excess", transform=lambda s: s.abs()), zc("kospi_vol"), zc("defense_excess")], axis=1).mean(axis=1)
    z["attention"] = zc("views", transform=lambda s: np.log1p(s))
    _, kinds = robust_z(weekly["share_military"]) if "share_military" in weekly else (None, pd.Series(dtype=object))

    rows = []
    for t in weekly.index:
        zs = {k: (None if pd.isna(z.at[t, k]) else float(z.at[t, k])) for k in WEIGHTS}
        avail = {k: v for k, v in zs.items() if v is not None}
        if len(avail) >= 3:
            wsum = sum(WEIGHTS[k] for k in avail)
            base = sum(WEIGHTS[k] * min(max(v, 0), 4) for k, v in avail.items()) / wsum
            active = sum(1 for v in avail.values() if v >= 2)
            kti = base * (1.25 if active >= 2 else 1.0)
        else:
            kti, active = None, None
        lvl = None
        if kti is not None:
            lvl = 1 if kti < 1 else 2 if kti < 2 else 3 if kti < 3 else 4
        msw = weekly.at[t, "max_stage_w"]
        override = None
        if msw >= STAGE_W["S5"]:
            override = 5
        elif msw >= STAGE_W["S4"]:
            override = 4
        if override and (lvl is None or override > lvl):
            lvl = override
        def num(c, nd=3):
            v = weekly.at[t, c] if c in weekly else np.nan
            return None if pd.isna(v) else round(float(v), nd)
        rows.append({
            "week": t.strftime("%Y-%m-%d"),
            "kti": None if kti is None else round(kti, 3),
            "level": lvl, "override": bool(override), "active": active,
            **{f"z_{k}": (None if v is None else round(v, 3)) for k, v in zs.items()},
            "baseline": kinds.get(t) if len(kinds) else None,
            "event_score": round(float(weekly.at[t, "event_score"]), 2),
            "share_military": num("share_military"), "share_threat": num("share_threat"),
            "share_response": num("share_response"), "tone": num("tone"),
            "krw_excess": num("krw_excess"), "kospi_vol": num("kospi_vol"),
            "defense_excess": num("defense_excess"), "views": num("views", 0),
            "partial": t + pd.Timedelta(days=6) >= pd.Timestamp(TODAY),
        })

    # 캘린더: 연도·주차별 이벤트 점수
    cal = ev.assign(year=pd.to_datetime(ev["date"]).dt.isocalendar().year,
                    woy=pd.to_datetime(ev["date"]).dt.isocalendar().week).groupby(["year", "woy"], as_index=False)["score"].sum()

    def recent(df, days=200):
        if df is None:
            return []
        df = df.copy()
        df = df[pd.to_datetime(df["date"]) >= pd.Timestamp(TODAY - timedelta(days=days))].sort_values("date")
        return json.loads(df.round(4).to_json(orient="records", force_ascii=False))

    sched = pd.read_csv(DATA / "schedule.csv", dtype=str)
    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "weights": WEIGHTS, "domains": DOMAIN_KO, "stage_weights": STAGE_W,
        "sources": STATUS,
        "weekly": rows,
        "events": json.loads(ev.drop(columns=["week"]).to_json(orient="records", force_ascii=False)),
        "calendar": json.loads(cal.to_json(orient="records")),
        "media_daily": recent(daily_media),
        "finance_daily": recent(daily_fin),
        "attention_daily": recent(daily_att),
        "schedule": json.loads(sched.to_json(orient="records", force_ascii=False)),
    }
    (DATA / "kti.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    last = next((r for r in reversed(rows) if r["kti"] is not None), None)
    log("weeks", len(rows), "latest", last)


def main():
    only_compute = "--compute-only" in sys.argv
    if not only_compute:
        for f in (fetch_gdelt, fetch_fred, fetch_yahoo, fetch_pageviews):
            try:
                f()
            except Exception:  # noqa: BLE001
                traceback.print_exc()
    else:
        prev = DATA / "kti.json"
        if prev.exists():
            STATUS.update(json.loads(prev.read_text(encoding="utf-8")).get("sources", {}))
    compute()


if __name__ == "__main__":
    main()
