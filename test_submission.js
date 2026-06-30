import 'dotenv/config';
import fetch from 'node-fetch'; // Requires node 18+ for native fetch

async function runTests() {
  console.log('--- STARTING E2E TESTS ---');
  const endpoint = 'http://localhost:5174/api/contact';

  // Test 1: Missing Fields (400)
  console.log('\n[Test 1] Missing Fields');
  let res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test' }) // missing email, phone, etc.
  });
  let data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);

  // Test 2: Invalid Email (400)
  console.log('\n[Test 2] Invalid Email');
  res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      name: 'Test', 
      email: 'not-an-email', 
      phone: '123', 
      company: 'Test Co', 
      service: 'Web', 
      message: 'Hello' 
    })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);

  // Test 3: Message Exceeding Limit (400)
  console.log('\n[Test 3] Message Exceeding 5000 characters Limit');
  const longMessage = 'A'.repeat(5001);
  res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      name: 'Test', 
      email: 'test@example.com', 
      phone: '123', 
      company: 'Test Co', 
      service: 'Web', 
      message: longMessage 
    })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);

  // Test 4: Successful Submission (200) - SMTP Test
  console.log('\n[Test 4] Successful Submission (SMTP Test)');
  res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      name: 'Test System', 
      email: 'test@example.com', 
      phone: '1234567890', 
      company: 'Test Co', 
      service: 'Web', 
      message: 'This is an automated E2E test verifying SMTP.' 
    })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);

  console.log('\n--- TESTS COMPLETE ---');
}

runTests();
