const http = require("http");

// Test data
const testData = {
  testUserId: "693bfc9d180d6013e83b5d7d", // Regular user with completed profile
  adminUserId: "693bfcc38ef06104f30e9ddb", // Admin user

  async createOrder() {
    console.log("\n========== STEP 1: CREATE ORDER ==========\n");
    const orderData = {
      items: [
        {
          productId: "507f1f77bcf86cd799439011",
          productName: "Test Product 1",
          productImage: "/images/product.jpg",
          quantity: 2,
          unitPrice: 100,
          selectedSize: "M",
          selectedColor: "Red",
          total: 200,
        },
        {
          productId: "507f1f77bcf86cd799439012",
          productName: "Test Product 2",
          productImage: "/images/product2.jpg",
          quantity: 1,
          unitPrice: 50,
          selectedSize: "L",
          selectedColor: "Blue",
          total: 50,
        },
      ],
      subtotal: 250,
      deliveryFee: 50,
      totalAmount: 300,
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
          console.log(`Response Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode === 201 && parsed.order) {
              console.log(`✓ Order Created Successfully!`);
              console.log(`  Order ID: ${parsed.order._id}`);
              console.log(`  Status: ${parsed.order.status}`);
              console.log(`  Total Amount: ${parsed.order.totalAmount} EGP`);
              console.log(`  Items: ${parsed.order.items.length}`);
              resolve(parsed.order._id);
            } else {
              console.log(`✗ Failed to create order`);
              console.log(`Response:`, JSON.stringify(parsed, null, 2));
              reject(new Error(`Status ${res.statusCode}`));
            }
          } catch (e) {
            console.log(`✗ Error parsing response:`, data);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(orderData));
      req.end();
    });
  },

  async getUserOrders() {
    console.log("\n========== STEP 2: GET USER ORDERS ==========\n");

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
          console.log(`Response Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              console.log(`✓ User has ${parsed.length} order(s)`);
              parsed.forEach((order, idx) => {
                console.log(`  [${idx + 1}] Order #${order._id}`);
                console.log(`      Status: ${order.status}`);
                console.log(`      Total: ${order.totalAmount} EGP`);
                console.log(`      Items: ${order.items.length}`);
              });
              resolve(parsed);
            } else {
              console.log(`✗ Unexpected response format`);
              reject(new Error("Expected array of orders"));
            }
          } catch (e) {
            console.log(`✗ Error parsing response:`, data);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.end();
    });
  },

  async getAdminOrders() {
    console.log("\n========== STEP 3: GET ALL ORDERS (ADMIN) ==========\n");

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/orders/admin/all",
        method: "GET",
        headers: {
          "x-user-id": this.adminUserId,
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`Response Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              console.log(`✓ Found ${parsed.length} total order(s) in system`);
              parsed.forEach((order, idx) => {
                console.log(`\n  [${idx + 1}] Order #${order._id}`);
                console.log(`      Customer: ${order.userName}`);
                console.log(`      Email: ${order.userEmail}`);
                console.log(`      Phone: ${order.userPhone}`);
                console.log(`      Status: ${order.status}`);
                console.log(`      Total: ${order.totalAmount} EGP`);
                console.log(`      Items: ${order.items.length}`);
                console.log(
                  `      Payment: ${
                    order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online"
                  }`
                );
              });
              resolve(parsed);
            } else if (parsed.message === "Access denied - admin only") {
              console.log(`✗ Access Denied: This user is not an admin`);
              console.log(`  Make sure you're using an admin user ID`);
              reject(new Error("Not an admin"));
            } else {
              console.log(
                `✗ Unexpected response:`,
                JSON.stringify(parsed, null, 2)
              );
              reject(new Error("Unexpected response"));
            }
          } catch (e) {
            console.log(`✗ Error parsing response:`, data);
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.end();
    });
  },
};

async function runTest() {
  try {
    console.log("╔════════════════════════════════════════════╗");
    console.log("║   ORDER SYSTEM - END-TO-END TEST         ║");
    console.log("╚════════════════════════════════════════════╝");

    console.log("\nTest User ID:", testData.testUserId);
    console.log("Admin User ID:", testData.adminUserId);

    // Create order
    const orderId = await testData.createOrder();

    // Get user's orders
    await testData.getUserOrders();

    // Get all orders as admin
    await testData.getAdminOrders();

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║   ✓ ALL TESTS PASSED SUCCESSFULLY!        ║");
    console.log("╚════════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("\n╔════════════════════════════════════════════╗");
    console.error("║   ✗ TEST FAILED                           ║");
    console.error("╚════════════════════════════════════════════╝");
    console.error("\nError:", error.message);
    process.exit(1);
  }
}

// Wait 2 seconds to ensure server is ready, then run tests
setTimeout(runTest, 2000);
