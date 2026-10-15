
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerSection = document.getElementById("registerSection");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const message = document.getElementById("message");
const welcomeMessage = document.getElementById("welcomeMessage");
let users = JSON.parse(localStorage.getItem("users")) || [];

function showSection(section) {
    registerSection.classList.add("hidden");
    loginSection.classList.add("hidden");
    dashboardSection.classList.add("hidden");

    section.classList.remove("hidden");
    message.innerText = "";
}
document.getElementById("showLogin").addEventListener("click", function(event) {
    event.preventDefault();
    showSection(loginSection);
});

document.getElementById("showRegister").addEventListener("click", function(event) {
    event.preventDefault();
    showSection(registerSection);
});

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password.trim()) {
        message.innerText = "Please fill in all fields.";
        return;
    }

    const existingUser = users.find(function(user) {
        return user.email === email;
    });

    if (existingUser) {
        message.innerText = "This email is already registered.";
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    registerForm.reset();

    showSection(loginSection);
    message.style.color = "green";
    message.innerText = "Registration successful! Please log in.";
});

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    users = JSON.parse(localStorage.getItem("users")) || [];

    const loggedInUser = users.find(function(user) {
        return user.email === email && user.password === password;
    });

    if (loggedInUser) {
        localStorage.setItem("currentUser", JSON.stringify({
            id: loggedInUser.id,
            name: loggedInUser.name,
            email: loggedInUser.email
        }));

        loginForm.reset();
        openDashboard(loggedInUser);
    } else {
        message.style.color = "red";
        message.innerText = "Invalid email or password.";
    }
});

function openDashboard(user) {
    showSection(dashboardSection);
    welcomeMessage.innerText = "Welcome, " + user.name + "!";
}
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    showSection(loginSection);
    message.style.color = "green";
    message.innerText = "You have logged out successfully.";
});

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = savedUsers.find(function(user) {
        return user.id === currentUser.id &&
               user.email === currentUser.email;
    });

    if (validUser) {
        openDashboard(validUser);
    } else {
        localStorage.removeItem("currentUser");
        showSection(loginSection);
    }
} else {
    showSection(registerSection);
}
