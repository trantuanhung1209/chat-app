import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, GithubAuthProvider, sendEmailVerification, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsrGukX4jOqINlnTXWGya-HdMVWUsG790",
    authDomain: "web-chat-7bf9c.firebaseapp.com",
    projectId: "web-chat-7bf9c",
    storageBucket: "web-chat-7bf9c.firebasestorage.app",
    messagingSenderId: "489162518836",
    appId: "1:489162518836:web:f95beac8b80bdebd97f561"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

// show alert
const showAlert = (content = null, time = 3000, typeAlert = null) => {
    if (content) {
        const newAlert = document.createElement("div");
        newAlert.setAttribute("class", `alert ${typeAlert}`);
        newAlert.innerHTML = `
            <span class="alert-content">
                ${content}
            </span>
            <span class="alert-close">
                <i class="fa-solid fa-xmark"></i>
            </span>
        `;

        const alertList = document.querySelector(".alert-list")
        alertList.appendChild(newAlert);

        const alertClose = newAlert.querySelector(".alert-close");

        alertClose.addEventListener("click", () => {
            alertList.removeChild(newAlert);
        })
        setTimeout(() => {
            alertList.removeChild(newAlert);
        }, `${time}`);
    }
}
// End show alert

// validate Email
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
// End validate Email

const container = document.getElementById('container');
const btn_register = document.getElementById('register');
const btn_login = document.getElementById('login');

if (btn_register) {
    btn_register.addEventListener('click', () => {
        container.classList.add('active');
    });
}

if (btn_login) {
    btn_login.addEventListener('click', () => {
        container.classList.remove('active');
    });
}

// form register
const formRegister = document.querySelector("#form-register");
if (formRegister) {
    formRegister.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = formRegister.name.value;
        const email = formRegister.email.value;
        const password = formRegister.password.value;

        if (email && password && fullName) {
            if (validateEmail(email)) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Đăng ký thành công
                        const user = userCredential.user;
                        if (user) {
                            console.log(user);
                            const photoURL = user.photoURL;
                            var actionCodeSettings = {
                                url: `http://127.0.0.1:5501/index.html`
                            };
                            // Gửi email xác nhận
                            sendEmailVerification(user, actionCodeSettings)
                                .then(() => {
                                    // Lưu thông tin người dùng vào database
                                    set(ref(db, `users/${user.uid}`), {
                                        fullName: fullName,
                                        photoURL: photoURL,
                                        state: "online"
                                        
                                    }).then(() => {
                                        showAlert("Successfully signed up! Please verify your account email.", 5000, "alert--success");
                                        formRegister.name.value = "";
                                        formRegister.email.value = "";
                                        formRegister.password.value = "";
                                    });
                                })
                                .catch((error) => {
                                    showAlert("Unsuccessful signup! Please try again.", 5000, "alert--error");
                                });
                        }
                    })
                    .catch((error) => {
                        showAlert("Invalid or already existing email!", 5000, "alert--error");
                    });
            } else {
                showAlert("Email is invalid", 5000, "alert--error");
            }
        }
    });
}
// End form register

// form login
const formLogin = document.querySelector("#form-login");
if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = formLogin.email.value;
        const password = formLogin.password.value;

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Kiểm tra trạng thái xác minh email
                    if (user.emailVerified) {
                        // Email đã xác minh
                        window.location.href = "index.html";
                    } else {
                        // Email chưa xác minh
                        showAlert("Please verify your email before logging in.", 5000, "alert--error");
                        auth.signOut(); // Đăng xuất người dùng
                    }
                })
                .catch((error) => {
                    showAlert("Incorrect email or password.", 5000, "alert--error");
                });
        }
    });
}


// login with google
const buttonGoogle = document.querySelector("[button-google]");
if (buttonGoogle) {
    buttonGoogle.addEventListener("click", (event) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user) {
                    const fullName = user.displayName;
                    const uid = user.uid;
                    const photoURL = user.photoURL;
                    set(ref(db, `users/${uid}`), {
                        fullName: fullName,
                        photoURL: photoURL,
                        state: "online"
                    }).then(() => {
                        window.location.href = "index.html";
                    })
                }
            }).catch((error) => {
                showAlert("Unsuccessfully login with google", 5000, "alert--error");
            });
    })
}
//end login with google

// loggin with github
const buttonGithub = document.querySelector("[button-github]");
if (buttonGithub) {
    buttonGithub.addEventListener("click", (event) => {
        event.preventDefault();
        const provider = new GithubAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user) {
                    const fullName = user.displayName;
                    const uid = user.uid;
                    const photoURL = user.photoURL;
                    set(ref(db, `users/${uid}`), {
                        fullName: fullName,
                        photoURL: photoURL,
                        state: "online"
                    }).then(() => {
                        window.location.href = "index.html";
                    })
                }
            }).catch((error) => {
                showAlert("Unsuccessfully login with github", 5000, "alert--error");
            });
    })
}
// End login with github

// Forgot password
const formForgotPassword = document.querySelector("#form-forgot-password");
if (formForgotPassword) {
    formForgotPassword.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = formForgotPassword.email.value;

        if (email) {
            var actionCodeSettings = {
                url: `http://127.0.0.1:5500/form.html`
            };
            sendPasswordResetEmail(auth, email, actionCodeSettings)
                .then(() => {
                    showAlert("Successfully send email", 5000, "alert--success");
                    formForgotPassword.email.value = "";
                })
                .catch((error) => {
                    showAlert("Unsuccessfully send email", 5000, "alert--error");
                });
        }
    })
}
// End forgot password

