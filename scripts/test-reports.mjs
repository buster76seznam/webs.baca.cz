import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('Testing Weekly Report Endpoint...');
  try {
    const weeklyResponse = await fetch(`${BASE_URL}/api/crons/reports/weekly`);
    const weeklyData = await weeklyResponse.json();
    console.log('Weekly Report Response:', weeklyData);
  } catch (error) {
    console.error('Error testing weekly report:', error);
  }

  console.log('\nTesting Monthly Report Endpoint...');
  try {
    const monthlyResponse = await fetch(`${BASE_URL}/api/crons/reports/monthly`);
    const monthlyData = await monthlyResponse.json();
    console.log('Monthly Report Response:', monthlyData);
  } catch (error) {
    console.error('Error testing monthly report:', error);
  }
}

testEndpoints();
