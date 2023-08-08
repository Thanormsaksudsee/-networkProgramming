from threading import Thread

class myThread(Thread):
    def __init__(self, name):
        Thread.__init__(self)
        self.name = name
    
    def run(self):
        print('Hello, my name is %s\n' % self.name)


process1 = myThread('Process 1')
process2 = myThread('Process 2')
process3 = myThread('Process 3')
process1.start()
process2.start()
process3.start()