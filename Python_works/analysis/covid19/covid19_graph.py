# from statistics import mean, median
# from turtle import color
# import pandas as pd
# import matplotlib.pyplot as plt
# from pkg_resources import working_set

# covid19_data = r"..\source\COVID19_Infected_jp.csv"

# df = pd.read_csv(covid19_data, index_col=0, parse_dates=[0])


# plt.plot(df["感染者全体"].resample("M").sum(),color="k")
# plt.show()
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0,1,100)
y = x**2
fig, axes = plt.subplots(2, 2, figsize=(20, 12))
plt.show()