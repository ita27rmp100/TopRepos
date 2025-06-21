import os , schedule , time

def task() :
    print("Task will start executing right now")
    os.system('node filter.js')
    os.chdir(os.getcwd())
    os.system("git add .")
    commit = "Update the data of Top project list"
    os.system(f'git commit -m "{commit}"')
    os.system('git push')

schedule.every().day.at("00:00").do(task)

while True :
    schedule.run_pending()
    time.sleep(3600000)
    print("Check again")