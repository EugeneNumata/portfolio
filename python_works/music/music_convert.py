import os
import tkinter as tk 
import glob
import shutil
from tkinter import ttk
import re

# 何をしたいか？　→　アルバムなどのディレクトリを崩さずにmp4をmp3に変換したい。
# 音楽のあるディレクトリの2つ前がアーティスト名、1つ前がアルバム名となっているの、os.mkdir()でディレクトリを作っていく。
# まずアーティストディレクトリを一つづつfor文で回って、そのfor文の中でアルバムディレクトリをまたfor文で回って、その中でまたfor分で曲をmp3に変換する。

before_path = r"H:\音楽_バックアップ\オヤジからの音楽"
after_path = r"H:\音楽_バックアップ\all_songs"
player = glob.glob(before_path + "/*")
albam = glob.glob(before_path + "/**/*")
song = glob.glob(before_path+"/**/**/*")
artists = len(player)
albams = len(albam)
songs = len(song)
n=1
try:
    for i in player:
        # shutil.copy(i,after_path)
        # n += 1
        albampath = glob.glob(i+"/*")
        for j in albampath:
            songpath = glob.glob(j+"/*")
            for k in songpath:
                print(str(n) + "/" + str(songs) + k)
                n += 1
except re.error:
    n += 1
    #     for k in song:
    #         songname = os.path.basename(k)
    #         print(artistname + "__" + albamname + " / " +songname + "("+str(n)+")")
    #         n += 1


