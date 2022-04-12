# 同時に別タブをクリックできれば人の手で作業しているところが省略できるというコンセプト
import pyautogui
import sys
list_x = [[]]
list_y = [[]]
print("Ctrl + C で同時にクリックし、プログラムを終了できます。")
try:
    while True:
        sentence = input("クリックする場所を選んでエンターキーを押してください。")
        xy = pyautogui.position()
        x = xy.x
        y = xy.y
        list_x.append(x)
        list_y.append(y)
        print(xy)
        print(list_x)
        print(list_y)
except KeyboardInterrupt:
    print(len(list_x))
    l = len(list_x)
    for i in range(l-1):
        if (i == 0):
            pass
        else:
            x = list_x[i]
            y = list_y[i]
            pyautogui.click(x,y)
    print("\n終了")
    sys.exit()
# クリックした位置の座標を取得して
#tkinterで2つの場所の座標を変数として格納して、同時にクリック

# だめだった...タブの関係上同時にクリックすることができなかった