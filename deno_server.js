const root = new URL(".", import.meta.url);

const dailyCache = new Map();
const contractsCache = new Map();

const PRODUCTS = [
  { root: "A", name: "豆一", exchange: "DCE" },
  { root: "B", name: "豆二", exchange: "DCE" },
  { root: "M", name: "豆粕", exchange: "DCE" },
  { root: "Y", name: "豆油", exchange: "DCE" },
  { root: "P", name: "棕榈油", exchange: "DCE" },
  { root: "C", name: "玉米", exchange: "DCE" },
  { root: "CS", name: "玉米淀粉", exchange: "DCE" },
  { root: "I", name: "铁矿石", exchange: "DCE" },
  { root: "J", name: "焦炭", exchange: "DCE" },
  { root: "JM", name: "焦煤", exchange: "DCE" },
  { root: "L", name: "聚乙烯", exchange: "DCE" },
  { root: "V", name: "PVC", exchange: "DCE" },
  { root: "PP", name: "聚丙烯", exchange: "DCE" },
  { root: "EB", name: "苯乙烯", exchange: "DCE" },
  { root: "BZ", name: "纯苯", exchange: "DCE" },
  { root: "EG", name: "乙二醇", exchange: "DCE" },
  { root: "JD", name: "鸡蛋", exchange: "DCE" },
  { root: "LH", name: "生猪", exchange: "DCE" },
  { root: "PG", name: "液化石油气", exchange: "DCE" },
  { root: "RR", name: "粳米", exchange: "DCE" },
  { root: "LG", name: "原木", exchange: "DCE" },
  { root: "FB", name: "纤维板", exchange: "DCE" },
  { root: "BB", name: "胶合板", exchange: "DCE" },
  { root: "CU", name: "铜", exchange: "SHFE" },
  { root: "AL", name: "铝", exchange: "SHFE" },
  { root: "ZN", name: "锌", exchange: "SHFE" },
  { root: "PB", name: "铅", exchange: "SHFE" },
  { root: "NI", name: "镍", exchange: "SHFE" },
  { root: "SN", name: "锡", exchange: "SHFE" },
  { root: "AO", name: "氧化铝", exchange: "SHFE" },
  { root: "AU", name: "黄金", exchange: "SHFE" },
  { root: "AG", name: "白银", exchange: "SHFE" },
  { root: "RB", name: "螺纹钢", exchange: "SHFE" },
  { root: "HC", name: "热卷", exchange: "SHFE" },
  { root: "SS", name: "不锈钢", exchange: "SHFE" },
  { root: "WR", name: "线材", exchange: "SHFE" },
  { root: "RU", name: "橡胶", exchange: "SHFE" },
  { root: "BR", name: "丁二烯橡胶", exchange: "SHFE" },
  { root: "BU", name: "沥青", exchange: "SHFE" },
  { root: "FU", name: "燃料油", exchange: "SHFE" },
  { root: "SP", name: "纸浆", exchange: "SHFE" },
  { root: "SC", name: "原油", exchange: "INE" },
  { root: "LU", name: "低硫燃料油", exchange: "INE" },
  { root: "NR", name: "20号胶", exchange: "INE" },
  { root: "BC", name: "国际铜", exchange: "INE" },
  { root: "EC", name: "欧线集运", exchange: "INE" },
  { root: "TA", name: "PTA", exchange: "CZCE" },
  { root: "PX", name: "对二甲苯", exchange: "CZCE" },
  { root: "PR", name: "瓶片", exchange: "CZCE" },
  { root: "PF", name: "短纤", exchange: "CZCE" },
  { root: "MA", name: "甲醇", exchange: "CZCE" },
  { root: "UR", name: "尿素", exchange: "CZCE" },
  { root: "SH", name: "烧碱", exchange: "CZCE" },
  { root: "FG", name: "玻璃", exchange: "CZCE" },
  { root: "SA", name: "纯碱", exchange: "CZCE" },
  { root: "SF", name: "硅铁", exchange: "CZCE" },
  { root: "SM", name: "锰硅", exchange: "CZCE" },
  { root: "CF", name: "棉花", exchange: "CZCE" },
  { root: "CY", name: "棉纱", exchange: "CZCE" },
  { root: "SR", name: "白糖", exchange: "CZCE" },
  { root: "AP", name: "苹果", exchange: "CZCE" },
  { root: "PK", name: "花生", exchange: "CZCE" },
  { root: "CJ", name: "红枣", exchange: "CZCE" },
  { root: "RM", name: "菜粕", exchange: "CZCE" },
  { root: "OI", name: "菜油", exchange: "CZCE" },
  { root: "RS", name: "油菜籽", exchange: "CZCE" },
  { root: "WH", name: "强麦", exchange: "CZCE" },
  { root: "PM", name: "普麦", exchange: "CZCE" },
  { root: "RI", name: "早籼稻", exchange: "CZCE" },
  { root: "JR", name: "粳稻", exchange: "CZCE" },
  { root: "LR", name: "晚籼稻", exchange: "CZCE" },
  { root: "ZC", name: "动力煤", exchange: "CZCE" },
  { root: "SI", name: "工业硅", exchange: "GFEX" },
  { root: "LC", name: "碳酸锂", exchange: "GFEX" },
  { root: "PS", name: "多晶硅", exchange: "GFEX" },
  { root: "AD", name: "铸造铝合金", exchange: "GFEX" },
  { root: "PL", name: "铂", exchange: "GFEX" },
  { root: "PA", name: "钯", exchange: "GFEX" }
];

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function fetchText(url, encoding = "utf-8") {
  const response = await fetch(url, {
    headers: {
      Referer: "https://finance.sina.com.cn",
      "User-Agent": "Mozilla/5.0"
    }
  });
  if (!response.ok) throw new Error(`Sina status ${response.status}`);
  return new TextDecoder(encoding).decode(await response.arrayBuffer());
}

async function fetchAsciiCompatibleText(url) {
  const response = await fetch(url, {
    headers: {
      Referer: "https://finance.sina.com.cn",
      "User-Agent": "Mozilla/5.0"
    }
  });
  if (!response.ok) throw new Error(`Sina status ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return String.fromCharCode(...bytes);
}

function toDailySymbol(symbol) {
  return String(symbol || "").replace(/^nf_/i, "").toUpperCase();
}

function productNameForRoot(root) {
  return (PRODUCTS.find(product => product.root === root) || {}).name || root;
}

function nameFromSymbol(symbol) {
  const cleaned = String(symbol || "").replace(/^nf_/i, "").toUpperCase();
  const root = (cleaned.match(/^[A-Z]+/) || [""])[0];
  const suffix = cleaned.slice(root.length);
  const productName = productNameForRoot(root);
  if (!suffix) return productName || cleaned;
  if (suffix === "0") return `${productName}连续`;
  return `${productName}${suffix}`;
}

async function fetchSinaQuote(symbol) {
  const safe = /^[a-zA-Z0-9_]+$/.test(symbol) ? symbol : "nf_I2701";
  return fetchAsciiCompatibleText(`https://hq.sinajs.cn/list=${safe}`);
}

async function fetchSinaQuotes(symbols) {
  const safe = symbols.filter(symbol => /^[a-zA-Z0-9_]+$/.test(symbol)).slice(0, 80);
  return fetchAsciiCompatibleText(`https://hq.sinajs.cn/list=${safe.join(",")}`);
}

async function fetchSinaDailyKline(symbol) {
  const dailySymbol = toDailySymbol(symbol);
  const cached = dailyCache.get(dailySymbol);
  if (cached && Date.now() - cached.at < 60000) return cached.rows;

  const raw = await fetchText(`https://stock2.finance.sina.com.cn/futures/api/jsonp.php/var=/InnerFuturesNewService.getDailyKLine?symbol=${dailySymbol}`);
  const match = raw.match(/var=\((.*)\);?\s*$/s);
  const rows = match ? JSON.parse(match[1] || "null") : null;
  if (!Array.isArray(rows)) throw new Error(`No daily kline for ${dailySymbol}`);
  dailyCache.set(dailySymbol, { at: Date.now(), rows });
  return rows;
}

function parseSinaFutures(raw, symbol) {
  const match = raw.match(/="([^"]*)"/);
  if (!match || !match[1]) throw new Error("Empty Sina quote");
  const fields = match[1].split(",");
  const price = Number(fields[8] || fields[7] || fields[6]);
  if (!Number.isFinite(price) || price <= 0) throw new Error("Invalid Sina quote price");
  const quoteTime = fields[1] && fields[1].length === 6
    ? `${fields[1].slice(0, 2)}:${fields[1].slice(2, 4)}:${fields[1].slice(4, 6)}`
    : fields[1] || "";
  return {
    source: "sina",
    symbol,
    name: nameFromSymbol(symbol),
    time: fields[17] && quoteTime ? `${fields[17]} ${quoteTime}` : quoteTime,
    price,
    bid: Number(fields[6]) || null,
    ask: Number(fields[7]) || null,
    open: Number(fields[2]) || null,
    high: Number(fields[3]) || null,
    low: Number(fields[4]) || null,
    volume: Number(fields[13]) || null,
    raw: fields
  };
}

function parseSinaQuoteLines(raw) {
  const items = [];
  const pattern = /var hq_str_([a-zA-Z0-9_]+)="([^"]*)";/g;
  let match;
  while ((match = pattern.exec(raw))) {
    const fields = match[2].split(",");
    const price = Number(fields[8] || fields[7] || fields[6]);
    if (!fields[0] || !Number.isFinite(price) || price <= 0) continue;
    items.push({
      symbol: match[1],
      name: nameFromSymbol(match[1]),
      time: fields[17] && fields[1] && fields[1].length === 6
        ? `${fields[17]} ${fields[1].slice(0, 2)}:${fields[1].slice(2, 4)}:${fields[1].slice(4, 6)}`
        : "",
      price
    });
  }
  return items;
}

function candidateContracts(root) {
  const now = new Date();
  const candidates = new Set([`nf_${root}0`]);
  for (let offset = -1; offset <= 30; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    candidates.add(`nf_${root}${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return [...candidates];
}

function quoteIsFresh(item) {
  if (item.symbol.endsWith("0")) return true;
  const dateText = String(item.time || "").slice(0, 10);
  const quoteDate = new Date(`${dateText}T00:00:00`);
  return !Number.isNaN(quoteDate.getTime()) && Date.now() - quoteDate.getTime() < 10 * 24 * 60 * 60 * 1000;
}

async function fetchContracts(root) {
  const safeRoot = String(root || "I").toUpperCase().replace(/[^A-Z]/g, "");
  const cached = contractsCache.get(safeRoot);
  if (cached && Date.now() - cached.at < 5 * 60000) return cached.contracts;

  const quotes = parseSinaQuoteLines(await fetchSinaQuotes(candidateContracts(safeRoot)));
  const contracts = quotes
    .filter(item => item.symbol.toUpperCase().startsWith(`NF_${safeRoot}`))
    .filter(quoteIsFresh)
    .map(item => ({ symbol: item.symbol, name: item.name, price: item.price, time: item.time }))
    .sort((a, b) => {
      const aMain = a.symbol.endsWith("0") ? -1 : 0;
      const bMain = b.symbol.endsWith("0") ? -1 : 0;
      return aMain !== bMain ? aMain - bMain : a.symbol.localeCompare(b.symbol);
    });

  contractsCache.set(safeRoot, { at: Date.now(), contracts });
  return contracts;
}

function bestSince(rows, quote, side, entryDate) {
  const start = String(entryDate || "").slice(0, 10);
  const isShort = side === "short";
  const filtered = rows.filter(row => row.d >= start);
  if (!filtered.length) throw new Error("开仓日期之后没有日K数据");

  let best = isShort ? Infinity : -Infinity;
  let bestDate = "";
  for (const row of filtered) {
    const value = Number(isShort ? row.l : row.h);
    if (!Number.isFinite(value)) continue;
    if ((isShort && value < best) || (!isShort && value > best)) {
      best = value;
      bestDate = row.d;
    }
  }

  const todayValue = Number(isShort ? quote.low : quote.high);
  if (Number.isFinite(todayValue) && ((isShort && todayValue < best) || (!isShort && todayValue > best))) {
    best = todayValue;
    bestDate = quote.time ? quote.time.slice(0, 10) : "today";
  }

  if (!Number.isFinite(best)) throw new Error("无法计算最佳盈利价");
  return {
    symbol: quote.symbol,
    name: quote.name,
    side,
    entryDate: start,
    bestPrice: best,
    bestDate,
    source: "sina",
    basis: isShort ? "开仓以来最低价" : "开仓以来最高价",
    historySymbol: toDailySymbol(quote.symbol)
  };
}

async function handler(req) {
  const url = new URL(req.url);
  try {
    if (url.pathname === "/api/quote") {
      const symbol = url.searchParams.get("symbol") || "nf_I2701";
      return json(parseSinaFutures(await fetchSinaQuote(symbol), symbol));
    }
    if (url.pathname === "/api/products") return json({ products: PRODUCTS });
    if (url.pathname === "/api/contracts") {
      const root = url.searchParams.get("root") || "I";
      return json({ root, contracts: await fetchContracts(root) });
    }
    if (url.pathname === "/api/best") {
      const symbol = url.searchParams.get("symbol") || "nf_I2701";
      const side = url.searchParams.get("side") === "short" ? "short" : "long";
      const entryDate = url.searchParams.get("entryDate") || new Date().toISOString().slice(0, 10);
      const [quote, rows] = await Promise.all([
        fetchSinaQuote(symbol).then(raw => parseSinaFutures(raw, symbol)),
        fetchSinaDailyKline(symbol)
      ]);
      return json(bestSince(rows, quote, side, entryDate));
    }

    const html = await Deno.readTextFile(new URL("./index.html", root));
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return json({ error: error.message || String(error), source: "deno" }, 502);
  }
}

Deno.serve(handler);
