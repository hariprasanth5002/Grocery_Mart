const axios = require('axios');

async function test() {
  try {
    // 1. Register Owner
    const regRes = await axios.post('http://localhost:8081/api/auth/register', {
      name: "Sam Seller",
      email: "sam.seller99@example.com",
      password: "password123",
      phone: "1234567890",
      role: "OWNER",
      shopName: "Sam Shop",
      shopAddress: "123 Ave",
      businessType: "Grocery",
      gstNumber: "12345"
    });
    console.log("Register Res:", regRes.data);
    const { token, user } = regRes.data;

    // 2. Add Product
    console.log(`Adding product for owner user ID ${user.id}...`);

    // Fetch owner by user ID
    const ownerRes = await axios.get(`http://localhost:8081/api/owners/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Owner Res:", ownerRes.data);
    const ownerId = ownerRes.data.id;

    // Add product
    const prodRes = await axios.post(`http://localhost:8081/api/products/owner/${ownerId}`, {
      name: "Golden Apples",
      description: "Fresh apples",
      price: 2.50,
      stockQuantity: 50,
      category: "Fruits",
      imageUrl: ""
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Product Added:", prodRes.data);

  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}

test();
