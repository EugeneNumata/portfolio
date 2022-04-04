from statistics import mean, median
from turtle import color
import pandas as pd
import matplotlib.pyplot as plt
from pkg_resources import WorkingSet
csv = r"..\source\accomodation_info.csv"
df = pd.read_csv(csv, index_col=0, parse_dates=[0])

# resample("M")はMonthのMで、月単位の集計を行う為
# plt.plot(df["金額"].resample("M").sum(), color="k")

# plt.show()でグラフを表示する
# plt.show()





# 平均値(mean/AVERAGE)を出している
x_mean = df["顧客ID"].value_counts().mean()
print("平均値は : "+ str(x_mean)+"です。")

# 中央地(median)を出している
x_median = df["顧客ID"].value_counts().median()
print("中央値は : "+ str(x_median)+ "です。")

# 最小値(min)を求めている
x_min = df["顧客ID"].value_counts().min()
print("最小値は : " +str(x_min)+"です。")

# 最大値(max)を求めている
x_max = df["顧客ID"].value_counts().max()
print("最大値は : " + str(x_max)+"です。")

# pandasの出現頻度をカウントする、value_counts()という関数を使って出現頻度を求めている

x = df["顧客ID"].value_counts()
# 21という数字は最大値184と最小値1を21の区間で分けて表示するという意味
x_hist,t_hist,_ = plt.hist(x,21,color="k")
plt.show()
