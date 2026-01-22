/**
 * Google Apps Script - スプレッドシートにデータを保存
 *
 * 【設定手順】
 * 1. Google スプレッドシートを作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付けて保存
 * 4. デプロイ > 新しいデプロイ
 * 5. 種類: ウェブアプリ
 * 6. 実行ユーザー: 自分
 * 7. アクセスできるユーザー: 全員
 * 8. デプロイして表示されるURLをコピー
 * 9. App.jsx の GAS_URL にそのURLを設定
 */

function doPost(e) {
  try {
    // リクエストデータを取得
    const data = JSON.parse(e.postData.contents);
    const url = data.url || '';
    const email = data.email || '';
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

    // アクティブなスプレッドシートを取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('診断依頼');

    // シートがなければ作成
    if (!sheet) {
      sheet = ss.insertSheet('診断依頼');
      // ヘッダー行を追加
      sheet.appendRow(['受付日時', 'サイトURL', 'メールアドレス', 'ステータス']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
      sheet.setFrozenRows(1);
    }

    // データを追加
    sheet.appendRow([timestamp, url, email, '未対応']);

    // 最新のデータ行を取得して色付け
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 4).setBackground('#fff3cd'); // 未対応は黄色背景

    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: '登録完了' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GETリクエスト対応（テスト用）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'AI集客診断 API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// オプション: 新規登録時にメール通知
function sendNotificationEmail(url, email) {
  const recipient = Session.getActiveUser().getEmail();
  const subject = '【AI集客診断】新規診断依頼';
  const body = `
新しい診断依頼がありました。

■ サイトURL
${url}

■ メールアドレス
${email}

■ 受付日時
${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

スプレッドシートで確認してください。
  `;

  MailApp.sendEmail(recipient, subject, body);
}
