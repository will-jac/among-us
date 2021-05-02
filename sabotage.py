bashCommand = "curl localhost:3030"
import subprocess
import readline
import os
import time
while True:
    os.system('clear')
    print('Type the exact text: "jack" without the "" to stop the sabotage!')
    if input() == 'jack':
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print(str(output))
        time.sleep(1)
