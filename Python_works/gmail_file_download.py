import os
from tkinter.constants import BOTH, X
from imbox import Imbox 
import traceback
import datetime
import tkinter as tk
from tkinter import messagebox


def click_f():
    host= "imap.gmail.com" 
    username= user_name_entry.get() 
    password= password_entry.get() 
    
    download_folder= path_entry.get() 
    from_address = mail_entry.get() 
    ymd_0 = ymmd_entry.get()
    ymd = ymd_0.split("/")

    if username == "" or password == "" or download_folder == "" or from_address=="" or ymd_0=="":
        messagebox.showinfo("エラー","入力項目を入力してください")
    else:
        ymd_y = int(ymd[0])
        ymd_m = int(ymd[1])
        ymd_d = int(ymd[2])    
        if not os.path.isdir(download_folder):
            os.makedirs(download_folder, exist_ok=True)
        mail= Imbox(host, username=username, password=password, ssl=True, ssl_context=None, starttls=False)
        messages= mail.messages(sent_from=from_address,date__gt=datetime.date(ymd_y, ymd_m, ymd_d))
        n = 0
        for (uid, message) in messages:
            mail.mark_seen(uid)

            for idx, attachment in enumerate(message.attachments):
                try:
                    n = n + 1
                except:
                    print(traceback.print_exc())
        m = 0
        for (uid, message) in messages:
            print("処理中...")
            mail.mark_seen(uid)
            for idx, attachment in enumerate(message.attachments):
                try:
                    att_fn= attachment.get('filename')
                    download_path= f"{download_folder}/{att_fn}"
                    with open(download_path, "wb") as fp:
                        fp.write(attachment.get('content').read())
                        m = m+1
                        print(str(download_path)+" : "+str(m)+"/"+str(n) + " → Sucsess")
                        
                except:
                    print(traceback.print_exc())
        
        messagebox.showinfo("完了",str(m)+"件のダウンロードが完了しました。")
        root.destroy()


root = tk.Tk()
root.geometry("180x220")
root.title("メールからファイルをダウンロード")
Label_1 = tk.Label(root, text="ここに自分のメールアドレスを入力")
Label_1.pack(anchor = tk.W)
user_name_entry = tk.Entry(width=30)
user_name_entry.pack(anchor = tk.W)
Label_2 = tk.Label(root, text="ここにGoogleのパスワードを入力")
Label_2.pack(anchor = tk.W)
password_entry = tk.Entry(width=30)
password_entry.pack(anchor = tk.W)
Label_3 = tk.Label(root, text="ここに移動後のフォルダパスを入力")
Label_3.pack(anchor = tk.W)
path_entry = tk.Entry(width=30)
path_entry.pack(anchor = tk.W)
Label_4 = tk.Label(root, text="ここに検索したいメールアドレスを入力")
Label_4.pack(anchor = tk.W)
mail_entry = tk.Entry(width=30)
mail_entry.pack(anchor = tk.W)
label_4_5 = tk.Label(text = "ここに検索年月を入力")
label_4_5.pack(anchor=tk.W)
ymmd_entry = tk.Entry(width=30)
ymmd_entry.pack(anchor=tk.W)


button = tk.Button(text="実行",command=click_f,borderwidth=2,relief="sunken",)
button.pack(anchor=tk.W,fill=tk.X)

root.mainloop()
