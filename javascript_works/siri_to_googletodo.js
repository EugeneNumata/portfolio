var ssid = "ssid";
var ssname = "log";
var tasklistid = "tokenid";



function doPost(e) {
  var params = JSON.parse(e.postData.getDataAsString()); // POSTされたデータを取得
  var myData = params.mydata.value;  // ショートカットで指定したPOSTデータを取得
  var result = {};
     
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  // addLog("params is :" + JSON.stringify(params)); // デバッグ用
  
  if (myData){
    
    result = {
      "success" : {
        "message" : "正常に処理されました。"
      }
    };
    addLog( JSON.stringify(myData) ); // スプレッドシートにショートカットから送信されてきたデータを記録
    
  } else {
    result = {
   "error": {
       "message": "データがありません。"
     }
   };
  }
  
  // 返すデータ（上記のresult）をセットする
  output.setContent(JSON.stringify(result));
  
  // リクエスト元（ショートカット）に返す
  return output;
}

function addLog(text) {
  var spreadsheetId = ssid; // スプレッドシートID
  var sheetName = ssname; // スプレッドシート名
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  sheet.appendRow([new Date(),text]); // スプレッドシートにタイムスタンプと引数を書き込む
  var lastrow = sheet.getLastRow();
  var task_title = sheet.getRange(lastrow,2).getValue();
  var task_title_2 = task_title.slice(1);
  var task_title_3 = task_title_2.slice(0,-1)
  const TASKLIST_ID = tasklistid;
  const task = {
    title: task_title_3
  };
 
  // タスク追加
  Tasks.Tasks.insert(task, TASKLIST_ID);
}

function idget(){
  var list = Tasks.Tasklists.list();
list.items.forEach(function(item) {
  Logger.log(item.title + " : " + item.id); 
});
}
