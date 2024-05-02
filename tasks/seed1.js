import fs from 'fs';

// Read the JSON file
const data = fs.readFile('data.json', 'utf8');

// Parse the JSON data
const jsonData = JSON.parse(data);

// Function to seed the database with users
function seedUsers(users) {
    const seededUsers = [];
    users.forEach(user => {
        // Create user in the database and obtain the object ID
        const userId = createUser(user);
        
        // Update the user object with the generated object ID
        user._id = userId;
        
        // Add the seeded user to the array of seeded users
        seededUsers.push(user);
        
        console.log(`Seeding user: ${user.username}`);
    });
    return seededUsers;
}

// Function to seed the database with posts
function seedPosts(posts) {
    // Insert posts into the database or perform other actions
    posts.forEach(post => {
        console.log(`Seeding post: ${post._id}`);
        // Your database insertion logic here
    });
}

// Function to seed the database with comments
function seedComments(comments) {
    // Insert comments into the database or perform other actions
    comments.forEach(comment => {
        console.log(`Seeding comment: ${comment._id}`);
        // Your database insertion logic here
    });
}

// Function to seed the database with keywords
function seedKeywords(keywords) {
    // Insert keywords into the database or perform other actions
    keywords.forEach(keyword => {
        console.log(`Seeding keyword: ${keyword.keyword}`);
        // Your database insertion logic here
    });
}

// Function to seed the database with reports
function seedReports(reports) {
    // Insert reports into the database or perform other actions
    reports.forEach(report => {
        console.log(`Seeding report: ${report._id}`);
        // Your database insertion logic here
    });
}

// Call the seed functions with the respective data
seedUsers(jsonData.users);
seedPosts(jsonData.posts);
seedComments(jsonData.comments);
seedKeywords(jsonData.keywords);
seedReports(jsonData.reports);
