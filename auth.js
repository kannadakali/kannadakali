const firebaseConfig = {
    apiKey: "AIzaSyCibChK0khiAsbuYn1XS_fJgjRVpVHoIe4",
    authDomain: "kannada-kali-site.firebaseapp.com",
    databaseURL: "https://kannada-kali-site-default-rtdb.firebaseio.com",
    projectId: "kannada-kali-site",
    storageBucket: "kannada-kali-site.appspot.com",
    messagingSenderId: "372598660818",
    appId: "1:372598660818:web:7e9490c68bc245c3f4570b",
    measurementId: "G-770H9Z1QP8"
  };

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const fullName = document.getElementById('fullName').value;
    const password = document.getElementById('registerPassword').value;
    
    // Create user with email and password
    auth.createUserWithEmailAndPassword(username + "@yourapp.com", password)
        .then((userCredential) => {
            // Save additional user info in Firestore
            db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                fullName: fullName
            });
        })
        .catch((error) => {
            console.error("Error registering new user:", error);
        });
});


// Handle Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Sign in with email and password
    auth.signInWithEmailAndPassword(username + "@yourapp.com", password)
        .then((userCredential) => {
            window.location.href = 'main.html'; // Redirect to main application page
        })
        .catch((error) => {
            console.error("Error logging in:", error);
        });
});

function showRegister() {
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('registerDiv').style.display = 'block';
}

function showLogin() {
    document.getElementById('loginDiv').style.display = 'block';
    document.getElementById('registerDiv').style.display = 'none';
}
