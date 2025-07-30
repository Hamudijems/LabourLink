const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore')

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

async function testRegistration() {
  console.log('🔥 Testing Firebase Registration...')
  
  try {
    // Test adding a worker
    const workerData = {
      fydaId: "6140798523917519",
      firstName: "Test",
      lastName: "Worker",
      phone: "+251911234567",
      email: "test.worker@example.com",
      region: "Addis Ababa",
      city: "Addis Ababa",
      userType: "worker",
      status: "pending",
      skills: ["Construction", "General Labor"],
      experience: "intermediate",
      registrationDate: new Date(),
      lastActive: new Date()
    }
    
    const workerRef = await addDoc(collection(db, "users"), workerData)
    console.log('✅ Worker registered with ID:', workerRef.id)
    
    // Test adding an employer
    const employerData = {
      fydaId: "3126894653473958",
      firstName: "Test",
      lastName: "Employer",
      phone: "+251922345678",
      email: "test.employer@example.com",
      region: "Addis Ababa",
      city: "Addis Ababa",
      userType: "employer",
      status: "pending",
      companyName: "Test Company Ltd",
      businessType: "Construction",
      registrationDate: new Date(),
      lastActive: new Date()
    }
    
    const employerRef = await addDoc(collection(db, "users"), employerData)
    console.log('✅ Employer registered with ID:', employerRef.id)
    
    // Test reading users
    const usersSnapshot = await getDocs(collection(db, "users"))
    const users = []
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    
    console.log(`📊 Total users in database: ${users.length}`)
    console.log(`👷 Workers: ${users.filter(u => u.userType === 'worker').length}`)
    console.log(`🏢 Employers: ${users.filter(u => u.userType === 'employer').length}`)
    
    console.log('🎉 Registration test completed successfully!')
    
  } catch (error) {
    console.error('❌ Registration test failed:', error)
  }
}

testRegistration()