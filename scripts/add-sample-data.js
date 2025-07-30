// Sample data to add to Firebase for testing
// Run this in browser console after logging into Firebase

const sampleJobs = [
  {
    title: "Construction Worker",
    employerName: "BuildCorp Ethiopia",
    location: "Addis Ababa",
    wage: "500",
    wageType: "day",
    duration: "2 weeks",
    skillsRequired: ["Construction", "Manual Labor"],
    status: "active",
    applicants: 5,
    employerId: "employer-1"
  },
  {
    title: "House Cleaner",
    employerName: "Clean Services ET",
    location: "Bole, Addis Ababa",
    wage: "300",
    wageType: "day",
    duration: "Ongoing",
    skillsRequired: ["Cleaning", "Housekeeping"],
    status: "active",
    applicants: 3,
    employerId: "employer-2"
  },
  {
    title: "Security Guard",
    employerName: "SecureGuard Ltd",
    location: "Piazza, Addis Ababa",
    wage: "400",
    wageType: "day",
    duration: "1 month",
    skillsRequired: ["Security", "Night Shift"],
    status: "active",
    applicants: 8,
    employerId: "employer-3"
  }
];

console.log("Sample jobs data:", sampleJobs);
console.log("Add these to Firebase manually or through admin panel");