#単語サイトから英単語を抜き出すプログラム
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import os

csv_name = "h1"

csv_out = ".csv"
w = "_out"

csv_file = csv_name+csv_out

csv_file_write = csv_name + w + csv_out

df = pd.read_csv(csv_file)
length = len(df)

list_df = [["word","translate","ex","ext"]] 

for i in range(length):
    data_i_col0 = df.iloc[i,0]
    data_i_col1 = df.iloc[i,1]
    print(data_i_col0)
    url = "https://ejje.weblio.jp/sentence/content/" + data_i_col0
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    tags = soup.find_all("div", class_="qotC")
    
    for tag in tags:
        list_data = []
        engs = tag.find_all("p", class_="qotCE")
        japs = tag.find_all("p", class_="qotCJ")
        eng = engs[0]
        jap = japs[0]
        e = eng.text[:-6]
        j = jap.contents[0]
        print(e)
        list_data.append(e)
        all_list = [data_i_col0, data_i_col1, e, j]
        list_df.append(all_list)
        df_new = pd.DataFrame(list_df)
        df_new.to_csv(csv_file_write,header=False)
        print("sucsess")
        time.sleep(5)
        if len(list_data) == 1:
            break
        else:
            print("error...")
