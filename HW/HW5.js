// Patcharaphon Koosomsarp
// Given an integer n, break it into the sum of k positive integers, where k >= 2, and find maximize the product of those integers.


// Exmaple output:
// Input: n = 2
// Output: 1
// Explanation: 2 = 1 + 1, 1 × 1 = 1
// Input: n = 5
// Output: 6
// Explanation: 5 = 2 + 3, 2 × 3 = 6
// Input: n = 7
// Output: 12
// Explanation: 7 = 2 + 2 + 3, 2 × 2 × 3 = 12
// Input: n = 10
// Output: 36
// Explanation: 10 = 2 + 2 + 3 + 3, 2 × 2 × 3 × 3 = 36
// Input: n = 15
// Output: 243
// Explanation: 15 = 3 + 3 + 3 + 3 + 3, 3 × 3 × 3 × 3 × 3 = 243

function BigkamuMAXimize(n) {
    if (n <= 3) {
      return n - 1; // ถ้า n เป็น 1, 2, 3 ไม่สามารถแยกออกเป็นจำนวนเต็มบวก k จำนวนได้มากกว่า 1 อันดับ และผลคูณมากที่สุดคือ n - 1
    }
  
    let product = 1;
    while (n > 4) {
      product *= 3;
      n -= 3;
      console.log(product);
    }
    product *= n;
  
    return product;
  }
  
  // ตัวอย่างการใช้งานฟังก์ชัน
  console.log(BigkamuMAXimize(2)); // Output: 1
  console.log(BigkamuMAXimize(5)); // Output: 6
  console.log(BigkamuMAXimize(7)); // Output: 12
  console.log(BigkamuMAXimize(10)); // Output: 36
  console.log(BigkamuMAXimize(15)); // Output: 243
  console.log(BigkamuMAXimize(3));

