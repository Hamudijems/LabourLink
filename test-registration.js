// Test registration directly
const testRegistration = async () => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Worker',
        email: 'testworker@example.com',
        phone: '+251911111111',
        fin: '1234567890123456',
        fan: '9876543210987654',
        region: 'Addis Ababa',
        city: 'Addis Ababa',
        userType: 'worker',
        skills: 'Testing, Development'
      })
    })
    
    const data = await response.json()
    console.log('Registration response:', data)
  } catch (error) {
    console.error('Registration test failed:', error)
  }
}

testRegistration()