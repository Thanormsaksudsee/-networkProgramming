from threading import Thread
import threading
import time

class myThread(Thread): 
    def __init__(self, thredID, name, counter):
        Thread.__init__(self)
        self.threadID = thredID
        self.name = name
        self.counter = counter
    
    def printTime(self, threadName, delay, counter):
        while counter:
            time.sleep(delay)
            print('%s: %s' %(threadName, time.ctime(time.time())))
            counter -= 1
        
    def run(self):
        print('Starting %s' %self.name)
        threadLock.acquire()
        self.printTime(self.name, self.counter, 3)
        threadLock.release()


threadLock = threading.Lock()
threads = []

thread1 = myThread(1, 'Thread 1', 1)
thread2 = myThread(2, 'Thread 2', 2)

thread1.start()
thread2.start()

threads.append(thread1)
threads.append(thread2)

for t in threads:
    t.join()

print('Exiting main thread')