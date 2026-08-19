
import fetch from 'node-fetch';

async function testOrders() {
    console.log("🚀 Testing /api/orders with non-ASCII data...");
    
    const payload = {
        companyName: "Weby ščřýáíéůú",
        companyPhone: "+420123456789",
        companyEmail: "test@example.com",
        companyAddress: "Praha, Šumavská 123",
        ownerName: "Jan Novák",
        ownerPhone: "+420987654321",
        ownerEmail: "jan.novak@example.com",
        industry: "IT a Webové služby",
        domain: "test-diacritics.cz",
        description: "Testování diakritiky v hlavičkách a body. ščřžýáíé",
        advantage: "Skvělá diakritika",
        priceList: "Vše za 0 Kč",
        workingHours: "Po-Pá 9-17",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        language: "cs"
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("✅ Response:", data);
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

testOrders();
