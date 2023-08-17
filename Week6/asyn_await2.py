import asyncio

async def buaklek(a,b):
    return a + b

async def main():
    phonbuak = await buaklek(13, 10)
    print('ได้ผลบวก', phonbuak)

if __name__ == "__main__":
    asyncio.run(main(), debug=True)
