#pythonを用いて､スキャンしたpdfの内容を画像として数字を読み取り､その数字にリネームするプログラム
import os
from pathlib import Path
from pdf2image import convert_from_path
import glob
from PIL import Image
import sys
import pyocr
import pyocr.builders
import re
import shutil
import tkinter as tk
from tkinter import StringVar, ttk
from tkinter import filedialog

ocr_dir =  r"ocrしたいディレクトリを指定"




def dirdialog_clicked_1():
    iDir = os.path.abspath(os.path.dirname(__file__))
    iDirPath = filedialog.askdirectory(initialdir = iDir)
    entry_1.set(iDirPath)


   

def po():
    if run_dhirectry.get() != "":
        folder_b_name = run_dhirectry.get()
        files = glob.glob(folder_b_name+"/*.pdf")
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
            pdf_path = os.path.dirname(Path(pdf_name))
            os.chdir(pdf_path)
            folder = pdf_path+"/OCR"
            try:
                if not os.path.exists("OCR"):
                    os.mkdir(folder)      
                    os.chdir(folder)      
                    if no_0 != "":
                        if os.path.exists(no):
                            n = str(no_0)+"_2.pdf"
                            os.rename(pdf_name,n)
                            shutil.move(n,folder)
                            os.chdir(ocr_dir)
                            os.remove(image_path)
                            n = n+1
                            print(str(no_0)+"完了 ("+str(n)+"/"+str(length)+")")
                        else:
                            os.rename(pdf_name,no)
                            shutil.move(no,folder)
                            os.chdir(ocr_dir)
                            os.remove(image_path)
                            n = n + 1
                            print(str(no)+"完了 ("+str(n)+"/"+str(length)+")")

                   
                    else:
                        shutil.move(pdf_name,folder)
                        os.chdir(ocr_dir)
                        os.remove(image_path)
                        n = n + 1
                        print("Pass ("+str(n)+"/"+str(length)+")")
                elif os.path.exists("OCR"):
                    os.chdir(folder)      
                    if no_0 != "":
                        if os.path.exists(pdf_path+"/"+no):
                            n = no_0+"_2.pdf"
                            os.rename(pdf_name,n)
                            shutil.move(n,folder)
                            os.chdir(ocr_dir)
                            os.remove(image_path)
                            n = n+1
                            print(str(no_0)+"完了 ("+str(n)+"/"+str(length)+")")
                        else:
                            os.rename(pdf_name,no)
                            shutil.move(no,folder)
                            os.chdir(ocr_dir)
                            os.remove(image_path)
                            n = n + 1
                            print(str(no)+"完了 ("+str(n)+"/"+str(length)+")")

                   
                    else:
                        shutil.move(pdf_name,folder)
                        os.chdir(ocr_dir)
                        os.remove(image_path)
                        n = n + 1
                        print("Pass ("+str(n)+"/"+str(length)+")")
                else:
                    print("Error")
            except FileExistsError:
                n = str(no_0)+"_2.pdf"
                os.rename(pdf_name,n)
                shutil.move(n,folder)
                os.chdir(ocr_dir)
                os.remove(image_path)
                n = n+1
                print(str(no_0)+"完了 ("+str(n)+"/"+str(length)+")")
            except shutil.Error:
                os.chdir(ocr_dir)
                os.remove(image_path)
                n = n+1
                print(str(no_0)+"完了 ("+str(n)+"/"+str(length)+")")



        print("Finish")
        sys.exit()
               
    else:
        print("please choice a dhirectry")



root = tk.Tk()
root.geometry("300x100")
root.title("OCR")
entry_1 = StringVar()
run_dhirectry = ttk.Entry(root, textvariable=entry_1, width=30)
run_dhirectry.place(x=100,y=10)
button_entry = ttk.Button(root, text="未着手参照",command=dirdialog_clicked_1)
button_entry.place(x=10,y=10)





button_start = tk.Button(text="開始",width=38,command=po)
button_start.place(x=10,y=60)

root.mainloop()


#tesseractのインストール(japaneseを必ず入れる)
#popplerのインストール(7zip必要)とフォルダの中身を移動
#popplerのpathを通す
#フォルダ構造としては
#･OCR
#→image_file
#→poppler
#ocr.py
