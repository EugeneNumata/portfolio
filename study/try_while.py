# while Trueの中で、入力待ちをしたかった。

import sys
try:
    while True:
        sentence = input("Enterキーを押すとTrueが出ます")
        print("True")
except KeyboardInterrupt:
    print("\n終了")
    sys.exit()
