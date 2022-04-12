# Ver 1.0 2022/04/12 
# 更新内容
# グラフで感染者と重症者の割合を出せるようにした。
# 次は、グラフをもっと見やすくするところから初めて、
# 最終的には、scikit-learnを使って今後の予想をできるようにしたい。
# 予想した値は破線で表示してわかりやすいようにしたい。

# ------------------




from cProfile import label
from re import X
from turtle import color
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import datetime as dt
from matplotlib.dates import DateFormatter
import matplotlib.dates as mdates


df = pd.read_csv(r".\source\covid19_db.csv")
print(df)
first_day = dt.date(2020,5,9)
x = []
l = len(df)
for i in range(l):
    day = first_day + dt.timedelta(days=i)
    x.append(day)
print(x)
x_0 = np.linspace(0,l,l)
y_1 = df["新規感染者"]
y_2 = df["重症者"]
y_3 = df["入院者"]
y_4 = df["入院予定者"]
y_5 = df["累計退院者"]
y_6 = df["累計死者"]

plt.plot(x,y_1,color="yellow",label="新規感染者")
plt.plot(x,y_2,color="red",label="重症者")
# plt.plot(x,y_3,color="orange",label="入院者")
plt.plot(x,y_6,color="black",label="累計死者")
plt.gca().xaxis.set_major_formatter(mdates.DateFormatter("%y/%m")) 
plt.gcf().autofmt_xdate() 
plt.show()