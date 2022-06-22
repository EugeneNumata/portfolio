import os
import tkinter as tk 
import glob
import shutil
from tkinter import ttk



# root = tk.Tk()
# root.geometry("500x700")
# b_path_entry = tk.Entry()
# b_path_entry.insert(0,"移動前")
# b_path_entry.pack()
# a_path_entry = tk.Entry()
# a_path_entry.insert(0,"移動後")
# a_path_entry.pack()
# kakutyousi = tk.Entry()
# kakutyousi.insert(0,".拡張子")
# kakutyousi.pack()


# b = b_path_entry.get()
# b_0 = b[1:]
# b = b_0[:-1]
before_path = r"H:\YouTube\MHRise_動画作成(配信)_MAD\動画作成\02_MAD\動画素材\Album"

# a = a_path_entry.get()
# a0 = a[1:]
# a = a0[:-1]
after_path = r"H:\YouTube\MHRise_動画作成(配信)_MAD\動画作成\02_MAD\動画素材\Allmp4"

# k = kakutyousi.get()
# mp4 = glob.glob(before_path + "/**/**/**/*"+k)
mp4 = glob.glob(before_path + "/**/**/**/*.mp4")
bar_max = len(mp4)

n=0
for i in mp4:
    shutil.copy(i,after_path)
    n += 1
    print(str(n)+" / "+str(bar_max))


# # mp4 = glob.glob(before_path + "/**/**/**/*"+kakutyousi.get())
# mp4 = glob.glob(before_path + "/**/**/**/*.mp4")


# bar_max = len(mp4)
# # after_path = a_path_entry.get()
# after_path = r"H:\YouTube\MHRise_動画作成(配信)_MAD\動画作成\02_MAD\動画素材\All"
# # progressbar = ttk.Progressbar(length=100,maximum=bar_max,mode="determinate",variable=n)
# # progressbar.pack()

# def start():
#     n=0
#     for i in mp4:
#         print(i)
#         shutil.copy(i,after_path)
#         n = n + 1
#         print(str(n)+" / "+str(bar_max))
#         # progressbar = ttk.Progressbar(length=100,maximum=bar_max,mode="determinate",variable=n)
        

# # button = tk.Button(text="start",command=start)
# # button.pack()


# start()

# num = 0

# root = tk.Tk()
# root.title("プログレスバー")


# #プログレスバーの初期設定
# progressbar = ttk.Progressbar(root, orient="horizontal", length=300, mode="determinate")
# progressbar.pack()
# maximum_bar = bar_max
# value_bar = 0
# div_bar = 1
# progressbar.configure(maximum=maximum_bar, value=value_bar)


# #プログレスバーの更新
# def var_start(value_bar):
#     progressbar.configure(value=value_bar)


#ボタンを押したら1秒ずつカウント、maximumに達したら終了しましたを表示
# def Click():
#     global value_bar, div_bar, text_label, num
#     for i in range(maximum_bar):
#         value_bar += div_bar
#         text_label.set(str(value_bar))

#         print("num = " + str(num))
#         num += 1

#         if value_bar == maximum_bar:
#             progressbar.after(1000, var_start(value_bar))
#             print("num = " + str(num))
#             text_label.set("終了しました")
#             root.destroy()

#         else:
#             progressbar.after(1000, var_start(value_bar))
#             progressbar.update()


# #ボタンとテキストラベルの作成
# button = tk.Button(text=u"START", command=Click)
# button.pack()
# text_label = tk.StringVar()
# text_label.set("0")
# label = tk.Label(textvariable=text_label)
# label.pack()

# root.mainloop()