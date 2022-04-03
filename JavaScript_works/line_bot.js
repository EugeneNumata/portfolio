const TOKEN = 'LINE ACSESS TOKEN';
var ssid = "SSID";
var ss = SpreadsheetApp.openById(ssid);
var url = "https://api.line.me/v2/bot/message/reply"



function doPost(e) {
  const responseLine = e.postData.getDataAsString();
  const event = JSON.parse(responseLine).events[0];
  var userid = event.source.userId;
  var json = e.postData.contents;
  var events = JSON.parse(json).events;
  


  events.forEach(function(event) {
  
    if(event.type == "follow"){
    var options = {"headers" : {"Authorization" : "Bearer " + TOKEN}};
    var j = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userid , options);
    var nick_name = JSON.parse(j).displayName;
    var sheet = ss.insertSheet();
    sheet.setName(userid);
    
    sheet.getRange("A1").setValue("タイムスタンプ");
    sheet.getRange("B1").setValue("身体点数");
    sheet.getRange("C1").setValue("精神点数");
    sheet.getRange("D1").setValue("ストレス値");
    sheet.getRange("E1").setValue("体調不良");
    sheet.getRange("F1").setValue("睡眠の質");
    sheet.getRange("N1").setValue("あり抽出→");
    sheet.getRange("O1").setValue('=IFERROR(QUERY(A1:F1000,"select A , B , C , D , E where E = 1",true))');
    var sheet_user = ss.getSheetByName("userlist");
    var last_user = sheet_user.getLastRow();
    var l_u = last_user+1;
    sheet_user.getRange(l_u,1).setValue(userid);
    sheet_user.getRange(l_u,2).setValue(nick_name);
    
    

    
    }else if (event.type == "message"){
      var json = JSON.parse(e.postData.contents);
      var reply_token= json.events[0].replyToken;
      if(event.message.type == "text"){
       response(event);
      
       
      }
  }else if (event.type="postback"){
    var w_data = event.postback.data.split("&")[0].replace("data=","");
    var w_item = event.postback.data.split("&")[1].replace("item=","");
    var sheet = ss.getSheetByName(userid);
    var last = sheet.getLastRow();
    var l = last + 1;
    var newdate = Utilities.formatDate(new Date(),"JST","YYYY/MM/dd HH:mm:ss");
    if(w_data == "survey1"){
      if (w_item)
      sheet.getRange(l,1).setValue(newdate);
      sheet.getRange(l,2).setValue(w_item);
      survey_mental(event);
    }else if (w_data == "survey2"){
      sheet.getRange(l-1,3).setValue(w_item);
      survey_stress(event)
    }else if(w_data=="survey3"){
      sheet.getRange(l-1,4).setValue(w_item);
      survey_bad(event);
    }else if (w_data=="survey4"){
      sheet.getRange(l-1,5).setValue(w_item);
      var time_now = new Date();
      if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<=10 ){
        morning(event);
        
      }else{
        response(event);
        
        
      }
    }else if (w_data = "survey0"){
      var time_now = new Date();
      if(Utilities.formatDate(time_now, 'Asia/Tokyo', 'HH')<=10 ){
        ;
      }
      else{
        sheet.getRange(l-1,6).setValue(w_item)
        response(event);
      }
      

      
      

    
    }
  }
function response(event){
  var user_sheet= ss.getSheetByName(userid);
  var user_stress_last_D = user_sheet.getRange(user_sheet.getMaxRows(), 4).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_stress_1_b_D = user_stress_last_D-1;
  var user_mental_last_C = user_sheet.getRange(user_sheet.getMaxRows(), 3).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_mental_1_b_C = user_mental_last_C-1;
  var user_physical_last_B = user_sheet.getRange(user_sheet.getMaxRows(), 2).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_physical_1_b_B = user_physical_last_B-1;
  var last_physical_range = user_sheet.getRange(user_physical_last_B,2);
  var last_physical = last_physical_range.getValue();
  var b_last_physical_range = user_sheet.getRange(user_physical_1_b_B,2);
  var b_last_physical = b_last_physical_range.getValue();
  var last_mental_range = user_sheet.getRange(user_mental_last_C,3);
  var last_mental = last_mental_range.getValue();
  var b_last_mental_range = user_sheet.getRange(user_mental_1_b_C,3);
  var b_last_mental =b_last_mental_range.getValue();
  var last_stress_range = user_sheet.getRange(user_stress_last_D,4);
  var last_stress = last_stress_range.getValue();
  var b_last_stress_range = user_sheet.getRange(user_stress_1_b_D,4);
  var b_last_stress = b_last_stress_range.getValue();
  if (last_physical >= b_last_physical && last_mental >= b_last_mental && last_stress>b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\nストレスが上がっているようです。\n他は下がっていないため、一度頭の中にあることを書き出して整理すると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental >= b_last_mental && last_stress <= b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n全体的に健康なようです。\nこの調子で頑張りましょう!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental < b_last_mental && last_stress > b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n精神的な疲れが見え、ストレスも高くなっています。\nストレスの分析はまた元気になったら行い、とりあえず今日は早く寝てみても良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental < b_last_mental && last_stress < b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n精神的に疲れているようです。\n今夜は少し気分転換をしてから寝ると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental >= b_last_mental && last_stress > b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n身体的な疲れが見え、ストレスも高くなっています。\nストレスの原因が解消すれば良くなるかもしれません。\n元気になったらストレスを紙に書き出してみると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental >= b_last_mental && last_stress < b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n身体的に疲れているようです。\nしかしストレスは減っているようです。\n今日は無理せず明日に備えましょう!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental < b_last_mental && last_stress > b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n全体的に負荷がかかっているようです。\n今は出来ることが限られてくると思いますので、出来ることから順番に行って早めに身体を休めましょう。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental < b_last_mental && last_stress < b_last_stress){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\n身体的な面と精神的な面で負荷がかかっているようです。\nしかしストレスが減っているので、今後良くなるかもしれません。\n良くなることを願ってます!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (b_last_stress == "ストレス値"){
    var message = {
      "replyToken":event.replyToken,
      "messages" :[{"type":"text","text":"記録を終わります。お疲れさまでした。\nもう少し分析はお待ち下さいm(_ _)m\nもう少しデータが溜まってからであれば対処をお伝えできます!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);    
  }
}


  })
}
function datty(){
  var userlist = ss.getSheetByName("userlist");
  var dat = userlist.getDataRange().getValues();
  for(var i =1; i<dat.length;i++){
    start(dat[i][0])
  }
}


function start(userid){
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + TOKEN,
  };
  var postData = {
    "to" : userid,
    "messages" :[
      {"type":"text","text" : "こんにちは。現時点での体調をお聞きします。\nまずは身体の点数を教えて下さい。",
      "quickReply":{
        "items":[
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"0",
              "data": "data=survey1&item=0",
              "displayText":"0"
            }
          },
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"20",
              "data": "data=survey1&item=20",
              "displayText":"20"
            }
          },
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"40",
              "data": "data=survey1&item=40",
              "displayText":"40"
            }
          },
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"60",
              "data": "data=survey1&item=60",
              "displayText":"60"
            }
          },
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"80",
              "data": "data=survey1&item=80",
              "displayText":"80"
            }
          },
          {
            "type":"action",
            "action":{
              "type": "postback",
              "label":"100",
              "data": "data=survey1&item=100",
              "displayText":"100"
            }
          },
        ]
      }
      }
    ]
  }
  var options = {
    "method" : "post",
    "headers": headers,
    "payload":JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(url,options)
}

function survey_mental(event){
  var message = {
    "replyToken":event.replyToken,
    "messages" :[
      {"type":"text","text":"今の精神の点数を教えて下さい。",
      "quickReply":{
        "items":[
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"0",
              "data":"data=survey2&item=0",
              "displayText": "0"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"20",
              "data":"data=survey2&item=20",
              "displayText": "20"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"40",
              "data":"data=survey2&item=40",
              "displayText": "40"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"60",
              "data":"data=survey2&item=60",
              "displayText": "60"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"80",
              "data":"data=survey2&item=80",
              "displayText": "80"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"100",
              "data":"data=survey2&item=100",
              "displayText": "100"
            }
          }
        ]
      }
      }
    ]
  };
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);
}

function survey_stress(event){
  var message = {
    "replyToken":event.replyToken,
    "messages" :[
      {"type":"text","text":"今のストレス値を教えて下さい。",
      "quickReply":{
        "items":[
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"0",
              "data":"data=survey3&item=0",
              "displayText": "0"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"20",
              "data":"data=survey3&item=20",
              "displayText": "20"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"40",
              "data":"data=survey3&item=40",
              "displayText": "40"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"60",
              "data":"data=survey3&item=60",
              "displayText": "60"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"80",
              "data":"data=survey3&item=80",
              "displayText": "80"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"100",
              "data":"data=survey3&item=100",
              "displayText": "100"
            }
          }
        ]
      }
      }
    ]
  };
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);
}


function survey_bad(event){
  var message = {
    "replyToken":event.replyToken,
    "messages" :[
      {"type":"text","text":"体調不良の有無を教えて下さい。",
      "quickReply":{
        "items":[
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"あり",
              "data":"data=survey4&item=1",
              "displayText": "あり"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"なし",
              "data":"data=survey4&item=0",
              "displayText": "なし"
            }
          }
        ]
      }
      }
    ]
  };
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);
}


function survey_end(event){
  var message = {
    "replyToken":event.replyToken,
    "messages" :[{"type":"text","text":"記録を終わります。\nお疲れさまでした。"}]
      };
    
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);
}


function morning(event){
  var message = {
    "replyToken":event.replyToken,
    "messages" :[
      {"type":"text","text":"睡眠の質を教えて下さい",
      "quickReply":{
        "items":[
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"よく寝れた",
              "data":"data=survey0&item=よく寝れた",
              "displayText": "よく寝れた"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"普通",
              "data":"data=survey0&item=普通",
              "displayText": "普通"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"あまり良く寝れなかった",
              "data":"data=survey0&item=あまり良く寝れなかった",
              "displayText": "あまり良く寝れなかった"
            }
          },
          {
            "type":"action",
            "action":{
              "type":"postback",
              "label":"寝ていない",
              "data":"data=survey0&item=寝ていない",
              "displayText": "寝ていない"
            }
          }
        ]
      }
      }
    ]
  };
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);

  var message = {
  "replyToken":event.replyToken,
  "messages" :[{"type":"text","text":"記録を終わります。\nお疲れさまでした。"}]
    };
    
  var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + TOKEN
  },
  "payload" :JSON.stringify(message)
  };
  UrlFetchApp.fetch(url,options);
}


function reply(){
  
  var url = "https://api.line.me/v2/bot/message/push";
  var users = ss.getSheetByName("userlist");
  var maxrow = users.getRange(users.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  for(var i = 2;i<=maxrow;i++){
  var userid = users.getRange(i,1).getValue();
  Logger.log(userid)
  var user_sheet= ss.getSheetByName(userid);
  var user_stress_last_D = user_sheet.getRange(user_sheet.getMaxRows(), 4).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_stress_1_b_D = user_stress_last_D-1;
  var user_mental_last_C = user_sheet.getRange(user_sheet.getMaxRows(), 3).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_mental_1_b_C = user_mental_last_C-1;
  var user_physical_last_B = user_sheet.getRange(user_sheet.getMaxRows(), 2).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  var user_physical_1_b_B = user_physical_last_B-1;
  var last_physical_range = user_sheet.getRange(user_physical_last_B,2);
  var last_physical = last_physical_range.getValue();
  var b_last_physical_range = user_sheet.getRange(user_physical_1_b_B,2);
  var b_last_physical = b_last_physical_range.getValue();
  var last_mental_range = user_sheet.getRange(user_mental_last_C,3);
  var last_mental = last_mental_range.getValue();
  var b_last_mental_range = user_sheet.getRange(user_mental_1_b_C,3);
  var b_last_mental =b_last_mental_range.getValue();
  var last_stress_range = user_sheet.getRange(user_stress_last_D,4);
  var last_stress = last_stress_range.getValue();
  var b_last_stress_range = user_sheet.getRange(user_stress_1_b_D,4);
  var b_last_stress = b_last_stress_range.getValue();
  if (last_physical >= b_last_physical && last_mental >= b_last_mental && last_stress>=b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"ストレスが上がっているようです。\n他は下がっていないため、一度頭の中にあることを書き出して整理すると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental >= b_last_mental && last_stress < b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"全体的に健康なようです。\nこの調子で頑張りましょう!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental < b_last_mental && last_stress >= b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"精神的な疲れが見え、ストレスも高くなっています。\nストレスの分析はまた元気になったら行い、とりあえず今日は早く寝てみても良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical >= b_last_physical && last_mental < b_last_mental && last_stress < b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"精神的に疲れているようです。\n今夜は少し気分転換をしてから寝ると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental >= b_last_mental && last_stress >= b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"身体的な疲れが見え、ストレスも高くなっています。\nストレスの原因が解消すれば良くなるかもしれません。\n元気になったらストレスを紙に書き出してみると良いかもしれません。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental >= b_last_mental && last_stress < b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"身体的に疲れているようです。\nしかしストレスは減っているようです。\n今日は無理せず明日に備えましょう!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental < b_last_mental && last_stress >= b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"全体的に負荷がかかっているようです。\n今は出来ることが限られてくると思いますので、出来ることから順番に行って早めに身体を休めましょう。"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (last_physical < b_last_physical && last_mental < b_last_mental && last_stress < b_last_stress){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"身体的な面と精神的な面で負荷がかかっているようです。\nしかしストレスが減っているので、今後良くなるかもしれません。\n良くなることを願ってます!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);
  }else if (b_last_stress == "ストレス値"){
    var message = {
      "to":userid,
      "messages" :[{"type":"text","text":"もう少し分析にお時間をくださいm(_ _)m\nもう少しデータが溜まってからであれば対処をお伝えできます!"}]
    };
    var options = {
     "method" : "post",
     "headers" : {
     "Content-Type" : "application/json",
      "Authorization" : "Bearer " + TOKEN
      },
     "payload" :JSON.stringify(message)
     };
    UrlFetchApp.fetch(url,options);    
    }
  }
}

function test(){
  var user_sheet = ss.getSheetByName("userlist");
  var maxrow = user_sheet.getRange(user_sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  for(var i = 2;i<=maxrow;i++){
    var user_id = user_sheet.getRange(i,1).getValue();
    var row = user_sheet.getRange(i,3).getRow()
    var columun = user_sheet.getRange(i,3).getColumn()
    Logger.log(user_id);
    var sheet = ss.getSheetByName(user_id);
    var max = sheet.getRange(sheet.getMaxRows(),2).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
    var dat = sheet.getRange(2,2,max-1,1).getValues();
    var n = 0;
    var m = 1;
    var l = 0;
    for (var h = 0;h<dat.length;h++){
      var n = n+1;
      var m = m +n;
      var val = dat[h][0];
      var l = val + l;
    }
    var e = 0;
    var a_0 = 0;
    var sum = m-1;
    var cnt = n;
    var ave_x = sum/cnt; 
    var ave_y = l/cnt
    
    for(var j = 0;j<dat.length;j++){
      var e = e+1;
      var y_o = dat[j][0];
      var x = e-ave_x;
      
      var y = y_o - ave_y;
      
      var s = x*y;
      var t = x*x;
      var u = s/t;
      var a_0 =++ u;
      
      
      
    }

    var nx = n-1;
    var b_0 = a_0*ave_x
    var b = ave_y-b_0
    var y = a_0*nx + b
    if (y>100){
      var y = 100;
    }else if (n<5){
      var y = 0;
    }
    Logger.log(y)
  
    

    
  }
}
function ave(){
  var user_sheet = ss.getSheetByName("userlist");
  var maxrow = user_sheet.getRange(user_sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  for(var i = 2;i<=maxrow;i++){
    var user_id = user_sheet.getRange(i,1).getValue();
    var row = user_sheet.getRange(i,3).getRow()
    var p_columun = user_sheet.getRange(i,3).getColumn()
    var m_columun = user_sheet.getRange(i,4).getColumn()
    var s_columun = user_sheet.getRange(i,5).getColumn()
    var sheet = ss.getSheetByName(user_id);
    var max = sheet.getLastRow()
    var dat = 0
    if(max>5){
      var p_val_1 = sheet.getRange(max-3,2).getValue()
      var p_val_2 = sheet.getRange(max-2,2).getValue();
      var p_val_3 = sheet.getRange(max-1,2).getValue();
      var p_val_4 = sheet.getRange(max,2).getValue();
      var p_dat = p_val_1+p_val_2+p_val_3+p_val_4; 
      var dat = p_val_1+p_val_2+p_val_3+p_val_4;
      var m_val_1 = sheet.getRange(max-3,3).getValue()
      var m_val_2 = sheet.getRange(max-2,3).getValue();
      var m_val_3 = sheet.getRange(max-1,3).getValue();
      var m_val_4 = sheet.getRange(max,3).getValue();
      var m_dat = m_val_1+m_val_2+m_val_3+m_val_4;

      var s_val_1 = sheet.getRange(max-3,4).getValue()
      var s_val_2 = sheet.getRange(max-2,4).getValue();
      var s_val_3 = sheet.getRange(max-1,4).getValue();
      var s_val_4 = sheet.getRange(max,4).getValue();
      var s_dat = s_val_1+s_val_2+s_val_3+s_val_4;


    }else{
      var dat = 0
    }
    if(dat!=0){
      var p_ave = p_dat/4;
      var m_ave = m_dat/4;
      var s_ave = s_dat/4;
      user_sheet.getRange(row,p_columun).setValue(p_ave);
      user_sheet.getRange(row,m_columun).setValue(m_ave);
      user_sheet.getRange(row,s_columun).setValue(s_ave);
    }else{
      var p_val_x = sheet.getRange(max,2).getValue()
      var m_val_x = sheet.getRange(max,3).getValue()
      var s_val_x = sheet.getRange(max,4).getValue()
      user_sheet.getRange(row,p_columun).setValue(p_val_x);
      user_sheet.getRange(row,m_columun).setValue(m_val_x);
      user_sheet.getRange(row,s_columun).setValue(s_val_x);
    }
    
    
    
  
  }
  
  
}
