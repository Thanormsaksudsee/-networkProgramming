import asyncio

async def main():
    print('thanormsak')
    await foo('text')
    print('finish') 

async def foo(text):
    print(text)
    await asyncio.sleep(5)
    
asyncio.run(main())