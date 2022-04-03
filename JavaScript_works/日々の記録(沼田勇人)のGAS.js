var ss = SpreadsheetApp.getActiveSpreadsheet();
var ssid = ss.getId();
var ss = SpreadsheetApp.openById(ssid);
var ssname_1 = "毎朝記入";
var ssname_2 = "records";
var fill = ss.getSheetByName(ssname_1);
var records = ss.getSheetByName(ssname_2);
var city_2 = 'Kanagawa-ken,JP'  
var id = '1f055370ea85cb5b9a3817bd37911525'
var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city_2+'&APPID='+id; 





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
  var time_now = new Date();
  var tx = text;
  let point = tx.split("/");
  var spirit_0 = point[0];
  var spirit = spirit_0.slice(1);
  var physical_0 = point[1];
  var physical = physical_0.slice(0,-1);

  if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<11){
    fill.getRange("D2").setValue(physical);
    fill.getRange("E2").setValue(spirit);
    Utilities.sleep(10000)
    add_todaydata()
  }
  if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')>=11 && Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<16 ){
    fill.getRange("D3").setValue(physical);
    fill.getRange("E3").setValue(spirit);
    Utilities.sleep(10000)
    add_todaydata()
  }
  if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')>=16){
    fill.getRange("D4").setValue(physical);
    fill.getRange("E4").setValue(spirit);
    Utilities.sleep(10000)
    add_todaydata()
  }
  weather_get()

}



function weather_get() {
  var res = UrlFetchApp.fetch(url);
  var weather_0 = UrlFetchApp.fetch(url+"&lang=ja&units=metric");
  var weather_data = JSON.parse(res.getContentText());
  var j = JSON.parse(weather_0.getContentText());
  var weather = j["weather"][0]["description"];
  var weather_code = j["weather"][0]["id"];
  var press = weather_data.main.pressure;
  var cur_temp = Math.round(weather_data.main.temp-273.15);
  var max_temp = Math.round(weather_data.main.temp_max-273.15);
  var min_temp = Math.round(weather_data.main.temp_min-273.15);
  var sunrise_0 = (weather_data.sys.sunrise)*1000;
  var sunrise = new Date(sunrise_0);
  var sunset_0 =(weather_data.sys.sunset)*1000;
  var sunset = new Date(sunset_0);
  var surise_url = UrlFetchApp.fetch(url+"&lang=ja&units=metric&date="+sunrise);
  var sunrise_weather_0 = JSON.parse(surise_url.getContentText());
  var sunrise_weather = sunrise_weather_0["weather"][0]["description"];
  var sunrise_weather_clouds = (sunrise_weather_0.clouds.all)/100;
  var weather_cell = 5;
  var cur_temp_cell = weather_cell+1;
  var press_cell = weather_cell+2;  
  
  

  try
  {
    
    fill.getRange("D"+weather_cell).setValue(weather);
    fill.getRange('D'+press_cell).setValue(press);
    fill.getRange('D'+cur_temp_cell).setValue(cur_temp);
    fill.getRange("D8").setValue(weather_code);
    fill.getRange("B9").setValue(sunrise);
    fill.getRange("B19").setValue(sunset);
    fill.getRange("B10").setValue(sunrise_weather);
    fill.getRange("B11").setValue(sunrise_weather_clouds);
  }catch(e){
    Browser.msgBox(e);
  }
  
}

function add_todaydata(){
  try{
    
      
      var time_now = new Date();

    
    if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<11){
      addwakeupdata()
      weather_get()
      Utilities.sleep(30000)
      var today_row = fill.getRange("B16").getValue();
      var phy_mor_val = fill.getRange('E2').getValue();
      var phy_noo_val = fill.getRange("E3").getValue();  
      var phy_eve_val = fill.getRange("E4").getValue();
      
      
      var men_mor_val = fill.getRange("D2").getValue();
      var men_noo_val = fill.getRange("D3").getValue();
      var men_eve_val = fill.getRange("D4").getValue();

      var job_time = fill.getRange('B2').getValue();
      var weather_val = fill.getRange('D5').getValue();
      var weather_code_val = fill.getRange("D8").getValue();
      var clouds_val = fill.getRange("B11").getValue();
      var press_val = fill.getRange('D7').getValue();
      var cur_temp_val = fill.getRange('D6').getValue();
      var job_today = fill.getRange('B3').getValue();
      var wakeup_sunrise = fill.getRange("B12").getValue();
      var sunp = fill.getRange("B14").getValue();
      var sleep_point = fill.getRange("B7").getValue();
      records.getRange('O'+today_row).setValue(job_time);
      
      records.getRange('AA'+today_row).setValue(weather_val);
      records.getRange('AH'+today_row).setValue(press_val);
      records.getRange('AI'+today_row).setValue(cur_temp_val);
      records.getRange('E'+today_row).setValue(job_today);
      records.getRange('F'+today_row).setValue(phy_mor_val);
      records.getRange('J'+today_row).setValue(men_mor_val);
      records.getRange('BH'+today_row).setValue(weather_code_val);
      records.getRange('BQ'+today_row).setValue(clouds_val);
      records.getRange("BS"+today_row).setValue(wakeup_sunrise);
      records.getRange("BT"+today_row).setValue(sunp);
      records.getRange("BA"+today_row).setValue(sleep_point);
      
      
    }
    if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')>=11 && Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<16 ){
      addwakeupdata()
      weather_get()
      var today_row = fill.getRange("B16").getValue();
      var phy_mor_val = fill.getRange('E2').getValue();
      var phy_noo_val = fill.getRange('E3').getValue();  
      var phy_eve_val = fill.getRange('E4').getValue();
      
      
      var men_mor_val = fill.getRange('D2').getValue();
      var men_noo_val = fill.getRange('D3').getValue();
      var men_eve_val = fill.getRange('D4').getValue();

      var job_time = fill.getRange('B2').getValue();
      var weather_val = fill.getRange('D5').getValue();
      var weather_code_val = fill.getRange("D8").getValue();
      var clouds_val = fill.getRange("B11").getValue();
      var press_val = fill.getRange('D7').getValue();
      var cur_temp_val = fill.getRange('D6').getValue();
      var job_today = fill.getRange('B3').getValue();
      var wakeup_sunrise = fill.getRange("B12").getValue();
      var sunp = fill.getRange("B14").getValue();
      var sleep_point = fill.getRange("B7").getValue();
      records.getRange('O'+today_row).setValue(job_time);

      records.getRange('AC'+today_row).setValue(weather_val);
      records.getRange('AJ'+today_row).setValue(press_val);
      records.getRange('AK'+today_row).setValue(cur_temp_val);
      records.getRange('E'+today_row).setValue(job_today);
      records.getRange('G'+today_row).setValue(phy_noo_val);
      records.getRange('K'+today_row).setValue(men_noo_val);
      records.getRange('BJ'+today_row).setValue(weather_code_val);
      records.getRange("BT"+today_row).setValue(sunp);
      
      
    }
    if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')>=16){

      var today_row = fill.getRange("B16").getValue();
      var phy_mor_val = fill.getRange("E2").getValue();
      var phy_noo_val = fill.getRange("E3").getValue();  
      var phy_eve_val = fill.getRange("E4").getValue();
            
      var men_mor_val = fill.getRange("D2").getValue();
      var men_noo_val = fill.getRange("D3").getValue();
      var men_eve_val = fill.getRange("D4").getValue();

      var job_time = fill.getRange('B2').getValue();
      var weather_val = fill.getRange('D5').getValue();
      var weather_code_val = fill.getRange("D8").getValue();
      var clouds_val = fill.getRange("B11").getValue();
      var press_val = fill.getRange('D7').getValue();
      var cur_temp_val = fill.getRange('D6').getValue();
      var job_today = fill.getRange('B3').getValue();
      var wakeup_sunrise = fill.getRange("B12").getValue();
      var sunp = fill.getRange("B14").getValue();
      var sleep_point = fill.getRange("B7").getValue();
      records.getRange('O'+today_row).setValue(job_time);

      records.getRange('AE'+today_row).setValue(weather_val);
      records.getRange('AL'+today_row).setValue(press_val);
      records.getRange('AM'+today_row).setValue(cur_temp_val);
      records.getRange('E'+today_row).setValue(job_today); 
      records.getRange('H'+today_row).setValue(phy_eve_val);
      records.getRange('L'+today_row).setValue(men_eve_val);
      records.getRange('BL'+today_row).setValue(weather_code_val);
      
    }  
  }catch(e){
    Browser.msgBox(e);
  }
}
function disc(){
  var day = fill.getRange("B18").getValue();
  if(day=="土曜日" || day=="日曜日"){
    var today_row = fill.getRange("B16").getValue();
    var today_cel = "E"+today_row;
    records.getRange(today_cel).setValue("休み");
    fill.getRange("B3").setValue("休み");
    fill.getRange("B2").setValue(0);
  }else{
    ;
  }
}
function datareset() {
  try{
    fill.getRange('D2:E4').clearContent();
    fill.getRange("B2:B6").clearContent();
    fill.getRange('B9:B11').clearContent();
    fill.getRange('B13').clearContent();
    fill.getRange('D5:D7').clearContent();
    fill.getRange('B19:20').clearContent();
  }catch(e){
    Browser.msgBox(e);
  }
}

function addwakeupdata(){
  var wakeuptime = fill.getRange("B8").getValue();
  var wakeupurl = UrlFetchApp.fetch(url+"&lang=ja&units=metric&date="+wakeuptime);
  var wakeuptime_weather_0 = JSON.parse(wakeupurl.getContentText());
  var wakeuptime_weather = wakeuptime_weather_0["weather"][0]["description"];
  var wakeuptime_weather_clouds = (wakeuptime_weather_0.clouds.all)/100;
  fill.getRange("B13").setValue(wakeuptime_weather);
  fill.getRange("B20").setValue(wakeuptime_weather_clouds);
}






