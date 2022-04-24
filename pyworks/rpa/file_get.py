from cProfile import label
import glob
import tkinter as tk
import pandas as pd
import sys
import os
import re
from tkinter import messagebox


path = ""

root = tk.Tk()
root.title = "ファイル一覧取得"
label = tk.Label(text="取得するフォルダのパスを入力してください。")
label.grid(row=0,column=0,columnspan=2,padx=5,pady=5,sticky=tk.W + tk.E)
entry = tk.Entry()
entry.grid(row=1,column=0,columnspan=2,padx=5,pady=5,sticky=tk.W + tk.E)

def click():
    path = entry.get()
    files = glob.glob(path + "/*") #一階層目のファイルを取る場合はこれでいいが、2階層目は/**/*でとり、三階層目は/**/**/*で取る(以下略)
    title = "file_list.txt"
    text = open(path+"/"+title,"w")
    for file in files:
        file = os.path.split(file)[1]
        target = "."
        idx = file.find(target)
        file = file[:idx]
        t = ".【"
        i = file.find(t)
        n = file[0:1]
        file = file[i+len(t):]
        file = "・"+n + file
        text.write(file+"\n"+"\n")  
    text.close()
    messagebox.showinfo("完了","同じディレクトリに、ファイル一覧をテキストで作成しました。")
    sys.exit()

def quit():
    sys.exit()

button_2 = tk.Button(text="終了",command=quit)
button_2.grid(row=2,column=0,padx=0,pady=5,sticky=tk.W + tk.E)
    
button_1 = tk.Button(text="開始",command=click)
button_1.grid(row=2,column=1,padx=0,pady=5,sticky=tk.W + tk.E)



root.mainloop()