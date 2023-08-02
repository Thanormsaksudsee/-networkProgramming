import json
books = ['book1','book2','book3']

# json.dumps(books)


string_books = json.dumps(['book1','book2','book3'])


type(string_books)


# <class 'str'>
#     books = ['book1','book2','book3']
#     list = json.loads(books)