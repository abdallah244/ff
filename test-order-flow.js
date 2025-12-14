const http = require("http");

// Test order flow
const tests = {
  testUserId: "693b5f950161d18b08d2fb3b", // Your test user ID

  async createOrder() {
    console.log("\n========== TEST: CREATE ORDER ==========");
    const orderData = {
      items: [
        {
          productId: "507f1f77bcf86cd799439011",
          productName: "Test Product",
          productImage: "/images/product.jpg",
          quantity: 2,
          unitPrice: 100,
          selectedSize: "M",
          selectedColor: "Red",
          total: 200,
        },
      ],
      subtotal: 200,
      deliveryFee: 50,
      totalAmount: 250,
      paymentMethod: "cod",
    };

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/orders",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": this.testUserId,
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            console.log(`Response:`, JSON.stringify(parsed, null, 2));
            if (parsed.order) {
              console.log(`✓ Order Created with ID: ${parsed.order._id}`);
              resolve(parsed.order._id);
            } else {
              console.log(`✗ No order in response`);
              reject(new Error("No order in response"));
            }
          } catch (e) {
            console.log(`Raw Response: ${data}`);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(orderData));
      req.end();
    });
  },

  async getAllOrders() {
    console.log("\n========== TEST: GET ALL ORDERS (ADMIN) ==========");
    // Use admin ID
    const adminUserId = "507f1f77bcf86cd799439012"; // Placeholder admin ID

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/orders/admin/all",
        method: "GET",
        headers: {
          "x-user-id": adminUserId,
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              console.log(`✓ Found ${parsed.length} orders`);
              parsed.forEach((order, idx) => {
                console.log(
                  `  [${idx + 1}] Order #${order._id} - Status: ${
                    order.status
                  } - Amount: ${order.totalAmount} EGP`
                );
              });
              resolve(parsed);
            } else {
              console.log(`Response:`, JSON.stringify(parsed, null, 2));
              reject(new Error("Expected array of orders"));
            }
          } catch (e) {
            console.log(`Raw Response: ${data}`);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.end();
    });
  },

  async getUserOrders() {
    console.log("\n========== TEST: GET USER ORDERS ==========");

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/orders/my-orders",
        method: "GET",
        headers: {
          "x-user-id": this.testUserId,
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              console.log(`✓ User has ${parsed.length} orders`);
              parsed.forEach((order, idx) => {
                console.log(
                  `  [${idx + 1}] Order #${order._id} - Status: ${order.status}`
                );
              });
              resolve(parsed);
            } else {
              console.log(`Response:`, JSON.stringify(parsed, null, 2));
              reject(new Error("Expected array of orders"));
            }
          } catch (e) {
            console.log(`Raw Response: ${data}`);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.end();
    });
  },
};

async function runTests() {
  try {
    console.log("🧪 Starting Order System Tests...\n");

    // Test 1: Create order
    const orderId = await tests.createOrder();

    // Test 2: Get user orders
    await tests.getUserOrders();

    // Test 3: Get all orders (as admin)
    await tests.getAllOrders();

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

runTests();
