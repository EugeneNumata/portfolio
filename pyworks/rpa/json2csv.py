import json
import pandas as pd

complete_file_name = "tasks"

json_file = r"./source_database/tasks.json"
complete_file_path = r"./complete_files/"

complete_file = complete_file_path + complete_file_name + ".csv"
jsn = open (json_file, "r", encoding="utf-8")
joj = json.load(jsn)

todolist = [[]]
for j in joj["items"]:
  items = j["items"]
  t = j["title"]
  for l in items:
    title = l["title"]
    todo = [t,title]
    todolist.append(todo)
df =pd.DataFrame(todolist[1:],columns=["大分類","ToDo"])
df.to_csv(complete_file)
