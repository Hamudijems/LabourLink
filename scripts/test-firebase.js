// Simple Firebase connection test
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyCxhuyDpDVrWGk4hB9hEATRg3KwU9V4Yaw",
  authDomain: "newompitation-project.firebaseapp.com",
  projectId: "newompitation-project",
  storageBucket: "newompitation-project.firebasestorage.app",
  messagingSenderId: "827431642092",
  appId: "1:827431642092:web:4c19b1ac64a89cf76656c9",
  measurementId: "G-6XY76L7G4B"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFirebase() {
  try {
    console.log('Testing Firebase connection...')
    
    // Test reading users collection
    const usersCollection = collection(db, "users")
    const snapshot = await getDocs(usersCollection)
    console.log(`Found ${snapshot.docs.length} users in database`)
    
    // Show first few users
    snapshot.docs.slice(0, 3).forEach(doc => {
      const data = doc.data()
      console.log(`User: ${data.name || data.firstName} - Type: ${data.userType} - Status: ${data.status}`)
    })
    
    // Add a test worker if no users exist
    if (snapshot.docs.length === 0) {
      console.log('No users found, adding test data...')
      
      await addDoc(usersCollection, {
        name: "Test Worker",
        firstName: "Test",
        lastName: "Worker",
        email: "test.worker@example.com",
        phone: "+251911234567",
        userType: "worker",
        status: "verified",
        fin: "1234567890123456",
        fan: "9876543210987654",
        isFaydaVerified: true,
        skills: ["Construction", "Carpentry"],
        registrationDate: new Date().toISOString().split('T')[0],
        region: "Addis Ababa"
      })
      
      await addDoc(usersCollection, {
        name: "Test Employer",
        firstName: "Test",
        lastName: "Employer",
        email: "test.employer@example.com",
        phone: "+251911234568",
        userType: "employer",
        status: "verified",
        fin: "6543210987654321",
        fan: "1357924680135792",
        isFaydaVerified: true,
        companyName: "Test Company Ltd",
        businessType: "Construction",
        registrationDate: new Date().toISOString().split('T')[0],
        region: "Addis Ababa"
      })
      
      console.log('Test data added successfully!')
    }
    
  } catch (error) {
    console.error('Firebase test failed:', error)
  }
}

testFirebase()