// Quick test to verify Firebase connection and user creation
import { addUser } from './services/firebase-services.js'

const testUser = {
  fydaId: 'TEST-123-456',
  firstName: 'Test',
  lastName: 'User',
  phone: '+251911234567',
  email: 'test@example.com',
  region: 'Addis Ababa',
  city: 'Addis Ababa',
  userType: 'worker',
  skills: ['Testing', 'Development']
}

console.log('Testing Firebase user creation...')
addUser(testUser)
  .then(userId => {
    console.log('✅ User created successfully with ID:', userId)
  })
  .catch(error => {
    console.error('❌ Failed to create user:', error)
  })