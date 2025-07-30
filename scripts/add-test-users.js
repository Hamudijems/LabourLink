// Add test users to Firebase
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

const testWorkers = [
  {
    name: "Abebe Tadesse",
    firstName: "Abebe",
    lastName: "Tadesse",
    email: "abebe.tadesse@example.com",
    phone: "+251911234567",
    userType: "worker",
    status: "verified",
    fin: "6140798523917519",
    fan: "3126894653473958",
    isFaydaVerified: true,
    skills: ["Construction", "Carpentry", "Masonry"],
    registrationDate: "2024-01-15",
    region: "Addis Ababa"
  },
  {
    name: "Almaz Bekele",
    firstName: "Almaz",
    lastName: "Bekele",
    email: "almaz.bekele@example.com",
    phone: "+251911234568",
    userType: "worker",
    status: "pending",
    fin: "6230247319356120",
    fan: "4567891234567890",
    isFaydaVerified: true,
    skills: ["Cleaning", "Housekeeping"],
    registrationDate: "2024-01-20",
    region: "Dire Dawa"
  },
  {
    name: "Dawit Haile",
    firstName: "Dawit",
    lastName: "Haile",
    email: "dawit.haile@example.com",
    phone: "+251911234569",
    userType: "worker",
    status: "verified",
    fin: "7890123456789012",
    fan: "2345678901234567",
    isFaydaVerified: true,
    skills: ["Plumbing", "Electrical Work"],
    registrationDate: "2024-01-18",
    region: "Bahir Dar"
  }
]

const testEmployers = [
  {
    name: "Meron Assefa",
    firstName: "Meron",
    lastName: "Assefa",
    email: "meron.assefa@buildcorp.et",
    phone: "+251911234570",
    userType: "employer",
    status: "verified",
    fin: "5432109876543210",
    fan: "9876543210987654",
    isFaydaVerified: true,
    companyName: "BuildCorp Ethiopia",
    businessType: "Construction",
    registrationDate: "2024-01-10",
    region: "Addis Ababa",
    jobsPosted: 5
  },
  {
    name: "Yohannes Tesfaye",
    firstName: "Yohannes",
    lastName: "Tesfaye",
    email: "yohannes@cleanservices.et",
    phone: "+251911234571",
    userType: "employer",
    status: "pending",
    fin: "1357924680135792",
    fan: "8642097531864209",
    isFaydaVerified: true,
    companyName: "Clean Services Ltd",
    businessType: "Services",
    registrationDate: "2024-01-22",
    region: "Hawassa",
    jobsPosted: 2
  }
]

async function addTestUsers() {
  try {
    console.log('Adding test users to Firebase...')
    
    // Check if users already exist
    const usersCollection = collection(db, "users")
    const snapshot = await getDocs(usersCollection)
    
    if (snapshot.docs.length > 0) {
      console.log(`Database already has ${snapshot.docs.length} users. Skipping test data creation.`)
      return
    }
    
    // Add test workers
    console.log('Adding test workers...')
    for (const worker of testWorkers) {
      await addDoc(usersCollection, worker)
      console.log(`Added worker: ${worker.name}`)
    }
    
    // Add test employers
    console.log('Adding test employers...')
    for (const employer of testEmployers) {
      await addDoc(usersCollection, employer)
      console.log(`Added employer: ${employer.name}`)
    }
    
    console.log('Test users added successfully!')
    console.log(`Total workers: ${testWorkers.length}`)
    console.log(`Total employers: ${testEmployers.length}`)
    
  } catch (error) {
    console.error('Error adding test users:', error)
  }
}

addTestUsers()