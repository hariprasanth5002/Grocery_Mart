async function test() {
  try {
    // 1. Register Owner
    let regRes = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Sam Seller",
        email: `sam.owner${Math.floor(Math.random()*10000)}@example.com`,
        password: "password123",
        phone: "1234567890",
        role: "OWNER",
        shopName: "Sam Shop",
        shopAddress: "123 Ave",
        businessType: "Grocery",
        gstNumber: "12345"
      })
    });
    let regData = await regRes.json();
    console.log("Register Res:", regData);
    if (!regRes.ok) throw new Error(JSON.stringify(regData));
    
    const { token, user } = regData;

    // 2. Add Product
    console.log(`Adding product for owner user ID ${user.id}...`);

    let ownerRes = await fetch(`http://localhost:8081/api/owners/user/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let ownerData = await ownerRes.json();
    console.log("Owner Res:", ownerData);
    if (!ownerRes.ok) throw new Error(JSON.stringify(ownerData));
    const ownerId = ownerData.id;

    // Add product
    let prodRes = await fetch(`http://localhost:8081/api/products/owner/${ownerId}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
       },
      body: JSON.stringify({
        name: "Golden Apples",
        description: "Fresh apples",
        price: 2.50,
        stockQuantity: 50,
        category: "Fruits",
        imageUrl: ""
      })
    });
    let prodData = await prodRes.json();
    console.log("Product Added:", prodData);

  } catch (err) {
    console.error("ERROR:", err.message || err);
  }
}

test();
