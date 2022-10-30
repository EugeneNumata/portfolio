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
fig = plt.figure()
ax1 = fig.subplots()
ax1.plot(x,y1,color="yellow",label="new_infection")
h1, l1 = ax1.get_legend_handles_labels()
plt.title("new_infection")
plt.gcf().autofmt_xdate() 
plt.show()
y = pd.Series(
    new_infection['#new_infection'].values, 
    index=pd.to_datetime(new_infection['date'], infer_datetime_format=True)
)
y = y.astype(float)
n_train = 120
train_data, test_data = y.values[:n_train], y.values[n_train:]