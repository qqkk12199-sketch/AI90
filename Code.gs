// 需求申請報名表：接收網頁表單並寫入 Google 試算表
const SHEET_ID = "1e1vGYhHXiQopzJ0tiKemxajIpUgS_UsOhqtCj2qpzUY";
const HEADERS = ["時間", "姓名", "單位", "電話", "Email", "需求簡述", "期望完成日期"];

// 避免內容以 = + - @ 開頭時被試算表當成公式執行
function safe(v) {
  v = String(v || "").trim();
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;
    if (p.website) return ContentService.createTextOutput("ignored"); // 機器人欄位

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      new Date(),
      safe(p.name),
      safe(p.unit),
      safe(p.phone),
      safe(p.email),
      safe(p.need),
      safe(p.due),
    ]);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

// 部署後用瀏覽器開網址可測試是否運作
function doGet() {
  return ContentService.createTextOutput("報名表服務運作中");
}
