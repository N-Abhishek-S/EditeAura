const data = {
  name: "Jane Doe",
  email: "janedoe@example.com",
  phone: "555-0199",
  company: "Acme Corp",
  service: "Social Media Management",
  message: "We need help growing our Twitter presence."
};

fetch('http://localhost:3005/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
