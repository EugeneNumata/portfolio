# Ver 1.0 
# 2022/04/12 
# 更新内容
# グラフで感染者と重症者の割合を出せるようにした。
# 次は、グラフをもっと見やすくする(凡例をつける)ところから初めて、
# 最終的には、scikit-learnを使って今後の予想をできるようにしたい。
# 予想した値は破線で表示してわかりやすいようにしたい。

# ------------------

# Ver 1.2
# 2022/04/13
# 更新内容
# Y軸を2つにして重症者と新規感染者の推移を見やすく、予想しやすくした。
# ここから未来を予想するには、
# 状態空間モデルを使用するのがいいと思った。
# Yt = H(Xt) + Wt
# Xt=F(Xt-1)+ G(Vi)
# Yt：時刻tの観測値。ベクトルの場合があるが、大抵はスカラー
# Xt：時刻 tの状態ベクトル
# H：状態を観測値に変換する関数。線形、非線形どちらの場合もあり、線形の場合は行列で表し、観測行列と呼ばれる
# F：状態を次の状態に変換する関数。線形、非線形どちらの場合もあり、線形の場合は行列で表し、状態推移行列と呼ばれる
# Wt：時刻 t の観測ノイズ
# Vt：時刻 t の状態ノイズ
# G：時刻 t の状態ノイズを変換する線形 or 非線形関数
# 参考サイト
# https://www.dskomei.com/entry/2021/01/22/181553

# ------------------

from cProfile import label
from turtle import color
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import datetime as dt
from matplotlib.dates import DateFormatter
import matplotlib.dates as mdates
import matplotlib.cm as cm

df = pd.read_csv(r".\source\covid19_db.csv")
first_day = dt.date(2020,5,9)
x = []
l = len(df)
for i in range(l):
    day = first_day + dt.timedelta(days=i)
    x.append(day)
x_0 = np.linspace(0,l,l)
y1 = df["new_infection"]
y2 = df["new_severe"]
fig = plt.figure()
ax1 = fig.subplots()
ax2 = ax1.twinx()
ax1.plot(x,y1,color="yellow",label="New infection")
ax2.plot(x,y2,color="red",label="New severe")
h1, l1 = ax1.get_legend_handles_labels()
h2, l2 = ax2.get_legend_handles_labels()
ax1.legend(h1 + h2, l1 + l2)
plt.title("New infection and new severe")
plt.gcf().autofmt_xdate() 
plt.show()