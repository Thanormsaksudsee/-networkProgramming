def BigkamuMAXimize(n):
    if n <= 3:
        return n - 1  

    product = 1
    while n > 4:
        product *= 3
        n -= 3
    product *= n

    return product


print(BigkamuMAXimize(2)) 
print(BigkamuMAXimize(5))  
print(BigkamuMAXimize(7))  
print(BigkamuMAXimize(10)) 
print(BigkamuMAXimize(15)) 
