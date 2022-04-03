var LINE_NOTIFY_TOKEN = "line_notify_token";
var LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";
var ssid = "spread_sheet_id";
var sheetname = "パソコン";
 
function doPost(e) {
  var params = JSON.parse(e.postData.getDataAsString()); // POSTされたデータを取得
  var myData = params.mydata.value;  // ショートカットで指定したPOSTデータを取得
  var result = {};
     
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
 
  
  if (myData){
    
    result = {
      "success" : {
        "message" : "正常に処理されました。"
      }
    };
    addLog( JSON.stringify(myData) );
    
  } else {
    result = {
   "error": {
       "message": "データがありません。"
     }
   };
  }

  output.setContent(JSON.stringify(result));
  

  return output;
}

function addLog(text) {
  var spreadsheetId = ssid; 
  var sheetName = sheetname;
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  sheet.appendRow([new Date(),text]);
  var lastrow = sheet.getLastRow();
  var msg_1 = sheet.getRange(lastrow,2).getValue();
  var msg_2 = msg_1.slice(1);
  var msg = msg_2.slice(0,-1)
  var response = UrlFetchApp.fetch(LINE_NOTIFY_API, {
  "method": "post",
  "headers": {
    "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
    },
  "payload": {
    "message": msg
    }
  });


}
