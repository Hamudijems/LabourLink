// Quick test data script for Firebase
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

const quickTestData = [
  // Test Workers
  {
    name: "Ahmed Hassan",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+251911111111",
    userType: "worker",
    status: "verified",
    fin: "6140798523917519",
    fan: "3126894653473958",
    isFaydaVerified: true,
    skills: ["Construction", "Carpentry"],
    registrationDate: new Date().toISOString().split('T')[0],
    region: "Addis Ababa"
  },
  {
    name: "Fatima Ali",
    firstName: "Fatima",
    lastName: "Ali",
    email: "fatima.ali@example.com",
    phone: "+251922222222",
    userType: "worker",
    status: "pending",
    fin: "6230247319356120",
    fan: "4567891234567890",
    isFaydaVerified: true,
    skills: ["Cleaning", "Housekeeping"],
    registrationDate: new Date().toISOString().split('T')[0],
    region: "Dire Dawa"
  },
  // Test Employers
  {
    name: "Sarah Mohammed",
    firstName: "Sarah",
    lastName: "Mohammed",
    email: "sarah@buildcorp.et",
    phone: "+251933333333",
    userType: "employer",
    status: "verified",
    fin: "5432109876543210",
    fan: "9876543210987654",
    isFaydaVerified: true,
    companyName: "BuildCorp Ethiopia",
    businessType: "Construction",
    registrationDate: new Date().toISOString().split('T')[0],
    region: "Addis Ababa",
    jobsPosted: 3
  },
  {
    name: "Daniel Tesfaye",
    firstName: "Daniel",
    lastName: "Tesfaye",
    email: "daniel@services.et",
    phone: "+251944444444",
    userType: "employer",
    status: "pending",
    fin: "1357924680135792",
    fan: "8642097531864209",
    isFaydaVerified: true,
    companyName: "Service Solutions Ltd",
    businessType: "Services",
    registrationDate: new Date().toISOString().split('T')[0],
    region: "Hawassa",
    jobsPosted: 1
  }
]

async function addQuickTestData() {
  try {
    console.log('Adding quick test data to Firebase...')
    
    const usersCollection = collection(db, "users")
    
    for (const userData of quickTestData) {
      await addDoc(usersCollection, userData)
      console.log(`Added ${userData.userType}: ${userData.name}`)
    }
    
    console.log('Quick test data added successfully!')
    console.log('You should now see data in both Workers and Employers pages.')
    
  } catch (error) {
    console.error('Error adding test data:', error)
  }
}

addQuickTestData()