#pdfのデータ格納の際のダブルチェックを行うプログラム
#画像を読み取り数字にして､その数字が名前に含まれているかどうかを確かめるプログラム
import os
from pathlib import Path
from subprocess import run
from pdf2image import convert_from_path
import glob
from PIL import Image
import sys
import pyocr
import pyocr.builders
import re
import shutil
import tkinter as tk
from tkinter import StringVar
from tkinter import ttk
from tkinter import filedialog
dc_dir = r"ダブルチェックするディレクトリ"





def pdfocr():
    run_folder = run_dhirectry.get()
    files = glob.glob(run_folder+"/**/**/**/*.pdf")
    name_list = []
    for file in files:
        name_list.append(file)
       

    length = len(name_list)
    n = 0

    for i in range(length):
        poppler_dir = Path(__file__).parent.absolute() / "poppler/bin"
        os.environ["PATH"] += os.pathsep + str(poppler_dir)

        pdf_path = Path(name_list[i])

        pages = convert_from_path(str(pdf_path), 200,last_page=None)
        image_dir = Path("./image_file")
        page = pages[0]
        file_name = pdf_path.stem + "_{:02d}".format(i + 1) + ".jpeg"
        image_path = image_dir / file_name
        page.save(str(image_path), "JPEG")


        tessera_path = r"C:\Program Files\Tesseract-OCR"
        os.environ["PATH"] += os.pathsep + str(tessera_path)

        tools = pyocr.get_available_tools()
        if len(tools) == 0:
            print("No OCR tool found")
            sys.exit(1)

        tool = tools[0]

       
        jpg_path = image_path
        txt = tool.image_to_string(Image.open(str(jpg_path)),lang="jpn",builder=pyocr.builders.TextBuilder(tesseract_layout=6))

        bn = "\n"
        bn_s = txt.split(bn)[0]
        no_0 = re.sub(r"\D", "", bn_s)
        no = no_0+".pdf"
        pdf_name = name_list[i]
        os.chdir(run_folder)
        t_f = run_folder+"/True"
        f_f = run_folder+"/False"
        p_f = run_folder+"/Pass"
        if no_0 != "":
            if no_0 in pdf_name :
                if not os.path.exists ("True"):
                    os.mkdir(t_f)
                    shutil.move(pdf_name, t_f)
                    os.chdir(dc_dir)
                    n = n+1
                    print("True ("+str(n)+"/"+str(length)+")")
                    os.remove(image_path)
                else:
                    shutil.move(pdf_name, t_f)
                    os.chdir(dc_dir)
                    n=n+1
                    print("true ("+str(n)+"/"+str(length)+")")
                    os.remove(image_path)
            else:
                if not os.path.exists("False"):
                    os.mkdir(f_f)
                    shutil.move(pdf_name, f_f)
                    os.chdir(dc_dir)
                    n = n+1
                    print("False ("+str(n)+"/"+str(length)+")")
                    os.remove(image_path)
                else:
                    shutil.move(pdf_name, f_f)
                    os.chdir(dc_dir)
                    n = n+1
                    print("false ("+str(n)+"/"+str(length)+")")
                    os.remove(image_path)
        else:
            if not os.path.exists("Pass"):
                os.mkdir(p_f)
                shutil.move(pdf_name,p_f)
                os.chdir(dc_dir)
                n=n+1
                print("Pass ("+str(n)+"/"+str(length)+")")
                os.remove(image_path)
            else:
                shutil.move(pdf_name, p_f)
                os.chdir(dc_dir)
                n=n+1
                print("pass ("+str(n)+"/"+str(length)+")")
                os.remove(image_path)
    print("Finish")
    sys.exit()

def dirdialog_clicked():
    iDir = os.path.abspath(os.path.dirname(__file__))
    iDirPath = filedialog.askdirectory(initialdir = iDir)
    entry_1.set(iDirPath)


root = tk.Tk()
root.geometry("350x40")
root.title("Double check")
entry_1 = StringVar()
run_dhirectry = ttk.Entry(root, textvariable=entry_1, width=40)
run_dhirectry.place(x=50,y=11)
button_re = tk.Button(text="参照",command=dirdialog_clicked)
button_re.place(x=10,y=8)
button_run = tk.Button(text="開始",command=pdfocr)
button_run.place(x=300,y=8)
root.mainloop()

