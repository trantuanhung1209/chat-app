import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove, onChildAdded, onChildChanged, onChildRemoved, child, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

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
const dbRef = ref(getDatabase());
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let currentUser = null;

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

// generate avatar
document.addEventListener('DOMContentLoaded', () => {
    new RetroAvatarGenerator();
});
function generateAvatar(
    text,
    foregroundColor = "white",
    backgroundColor = "black"
) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 100px Be Vietnam Pro";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
}
// end generate avatar

// get full name user 
function getFirstLetter(name) {
    // Tách họ tên thành các từ
    const str = name.split(" ");
    // Lấy chữ cái đầu của từng từ và viết hoa
    const firstLetter = str.map(letter => letter.charAt(0).toUpperCase()).join("");
    return firstLetter;
}
// end get full name user

// convert http to https
function convertHttpToHttps(url) {
    // Kiểm tra xem URL có bắt đầu bằng "http://" không
    if (url.startsWith("http://")) {
        // Thay thế "http://" bằng "https://"
        return url.replace("http://", "https://");
    }
    // Nếu không phải HTTP, trả về URL gốc
    return url;
}
// end convert http to https

// add AttachmentParam to download image 
function addAttachmentParam(url) {
    // Tìm vị trí "upload/" trong URL
    const uploadIndex = url.indexOf("upload/");

    if (uploadIndex === -1) {
        console.error("Không tìm thấy 'upload/' trong URL.");
        return url; // Trả về URL gốc nếu không có "upload/"
    }

    // Chỉnh sửa URL bằng cách thêm tham số fl_attachment vào sau "upload/"
    const updatedUrl = url.slice(0, uploadIndex + 7) + "fl_attachment/" + url.slice(uploadIndex + 7);

    return updatedUrl;
}
// End add AttachmentParam to download image 

// get user info 
function getUserInfo(userId) {
    const userRef = ref(db, `users/${userId}`);
    return get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Trả về thông tin người dùng
        } else {
            console.log("No user data found!");
            return null;
        }
    }).catch((error) => {
        console.error("Error fetching user data:", error);
    });
}
// end get user info


// bottom scroll
const topScroll = () => {
    const boxChat = document.querySelector("[box-chat]");
    if (boxChat) {
        boxChat.scrollTop = boxChat.scrollHeight + 5;
    }
}
// end bottom scroll

// show directory
const messageBoxButton = document.querySelector("[button-info]");
const directory = document.querySelector("#directory");
const buttonCloseInfor = document.querySelector("[button-close-infor]");
const buttonSetting = document.querySelector("[button-setting]");
if (messageBoxButton) {
    messageBoxButton.addEventListener("click", () => {
        if (directory.getAttribute("show") == "yes") {
            directory.setAttribute("show", "");
        } else {
            directory.setAttribute("show", "yes");
        }
    })
}

if (buttonCloseInfor) {
    buttonCloseInfor.addEventListener("click", () => {
        directory.setAttribute("show", "");
    })
}

if (buttonSetting) {
    buttonSetting.addEventListener("click", () => {
        if (directory.getAttribute("show") == "yes") {
            directory.setAttribute("show", "");
        } else {
            directory.setAttribute("show", "yes");
        }
    })
}
// End show directory

// logout
const buttonLogout = document.querySelector("[button-logout]");
if (buttonLogout) {
    buttonLogout.addEventListener("click", () => {
        const id = auth.currentUser.uid;
        update(ref(db, `users/${id}`), {
            state: "offline"
        }).then(() => {
            signOut(auth).then(() => {
                window.location.href = "form.html";
            }).catch((error) => {
                showAlert("Unsuccessfully logout!", 3000, "alert-error");
            });
        })
    })
}
// End logout

// check user exist
const directorySignup = document.querySelector(".directory__signup");
const buttonLogin = document.querySelector("[button-login]");
const buttonSignup = document.querySelector("[button-signup]");
if (buttonLogin && buttonSignup) {
    buttonLogin.addEventListener("click", () => {
        window.location.href = "form.html";
    })

    buttonSignup.addEventListener("click", () => {
        window.location.href = "form.html";
    })
}

const body = document.querySelector("body");
const messageBox = document.querySelector("[message-box]");
const messagePanel = document.querySelector("[message-panel]");
const avatars = document.querySelectorAll("[avatar]");
let isPageReload = sessionStorage.getItem('reloadFlag');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const fullName = user.displayName;

        // Hiển thị thông tin của người dùng hiện tại
        messageBox.style.display = "block";
        messagePanel.style.display = "block";
        directorySignup.style.display = "none";

        avatars.forEach((avatar) => {
            avatar.src = generateAvatar(`${uid}`, "white", "#264cca");
        });

        // Cập nhật trạng thái "online" cho người dùng hiện tại
        const userRef = ref(db, `users/${uid}`);
        update(userRef, {
            state: "online",
        }).catch((error) => {
            console.error("Failed to update user state:", error);
        });

        // Xử lý khi người dùng đóng tab hoặc tắt trình duyệt
        window.addEventListener("beforeunload", () => {
            // Kiểm tra xem đã logout trước đó chưa, nếu chưa thì thực hiện
            if (!isPageReload) {
                update(userRef, {
                    state: "offline"
                }).catch((error) => {
                    console.error("Failed to update user state on unload:", error);
                });

                // Đăng xuất người dùng
                signOut(auth).then(() => {
                    console.log("User logged out due to tab/browser close.");
                }).catch((error) => {
                    console.error("Error logging out:", error);
                });

                // Đánh dấu là đã thực hiện logout khi tắt trình duyệt
                sessionStorage.setItem('reloadFlag', 'true');
            }
        });

        // Thiết lập lại khi trang tải lại
        window.addEventListener("load", () => {
            sessionStorage.removeItem('reloadFlag'); // Xóa dấu hiệu khi tải lại trang
        });

    } else {
        // Nếu không có người dùng đăng nhập, hiển thị thông tin đăng nhập
        const h2 = document.createElement("h2");
        h2.setAttribute("class", "h2--home");
        h2.innerHTML = "Welcome to Web Chat!";

        const listButtonHome = document.createElement("div");
        listButtonHome.setAttribute("class", "list-button-home");

        const buttonLogin = document.createElement("button");
        buttonLogin.setAttribute("class", "button-login--home");
        buttonLogin.innerHTML = "Login";

        const buttonSignup = document.createElement("button");
        buttonSignup.setAttribute("class", "button-signup--home");
        buttonSignup.innerHTML = "Sign-up";

        body.appendChild(listButtonHome);
        body.appendChild(h2);
        listButtonHome.appendChild(buttonLogin);
        listButtonHome.appendChild(buttonSignup);

        buttonLogin.addEventListener("click", () => {
            window.location.href = "form.html";
        });
        buttonSignup.addEventListener("click", () => {
            window.location.href = "form.html";
        });

        // Cập nhật giao diện khi không có người dùng đăng nhập
        directorySignup.style.display = "flex";
        messageBox.style.display = "none";
        messagePanel.style.display = "none";

        // Reset avatar
        avatars.forEach((avatar) => {
            avatar.src = generateAvatar(`?`, "white", "#264cca");
        });
    }
});
// End check user exist

// form chat
const formChat = document.querySelector("[form-chat]");
if (formChat) {

    // preview image
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        maxFileCount: 6,
        multiple: true
    });
    // end preview image

    formChat.addEventListener("submit", async (event) => {
        event.preventDefault();

        const content = formChat.content.value;
        const userId = auth.currentUser.uid;
        const images = upload.cachedFileArray || [];

        if ((content || images.length > 0) && userId) {
            // Lấy thông tin người dùng (đồng bộ)
            const userInfo = await getUserInfo(userId);
            const fullName = userInfo.fullName; // Lấy tên người dùng
            const photoUrl = userInfo.photoURL ? userInfo.photoURL : null; // Lấy ảnh nếu có
            const ImagesLink = [];

            if (images.length > 0) {
                const url = 'https://api.cloudinary.com/v1_1/dav7n3cu7/image/upload';

                const formData = new FormData();

                for (let i = 0; i < images.length; i++) {
                    let file = images[i];
                    formData.append('file', file);
                    formData.append('upload_preset', 'TuanHung');

                    await fetch(url, {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            ImagesLink.push(data.url);
                        });
                }
            }

            // Lưu tin nhắn vào Firebase
            set(push(ref(db, "chats")), {
                content: content,
                userId: userId,
                fullName: fullName,
                photoUrl: photoUrl,
                images: ImagesLink
            });

            // Xóa nội dung trong form sau khi gửi
            formChat.content.value = "";
            upload.resetPreviewPanel(); // clear all selected images
        }
    });
}
// end form chat


// show message
const boxChat = document.querySelector("[box-chat]");
if (boxChat) {
    const chatsRef = ref(db, 'chats');
    onChildAdded(chatsRef, async (data) => {
        const key = data.key;
        const content = data.val().content;
        const userId = data.val().userId;
        const images = await data.val().images;

        const currentUser = auth.currentUser;

        // get user info
        const userInfo = await getUserInfo(userId);
        let photoUrl = userInfo.photoURL;
        const fullName = userInfo.fullName;

        if (!photoUrl && userInfo && userInfo.photoUrl) {
            photoUrl = userInfo.photoUrl;
        }
        if (!photoUrl) {
            photoUrl = generateAvatar(`${getFirstLetter(fullName)}`, "white", "#264cca");
        }

        const newChat = document.createElement("div");
        if (userId == currentUser.uid) {
            newChat.setAttribute("class", "message-box__chat--outgoing");
        } else {
            newChat.setAttribute("class", "message-box__chat--incoming");
        }

        let newAvatar = "";
        let newContent = "";
        if (content) {
            newContent = `
                <div class="message-box__chat--list-content">
                    <div class="message-box__chat--content">
                        ${content}
                    </div>
                </div>
            `;

            newAvatar = `
                <div class="message-box__chat--avatar">
                    <img src=${photoUrl} alt="Avatar" id="avatar">
                </div>
            `;
        }

        let htmlImages = "";
        if (images && images.length > 0) {
            htmlImages += `<div class="inner-images">`;

            images.forEach(image => {
                htmlImages += `
                    <img src="${image}" alt="Image" class="image">
                `;
            })

            htmlImages += `</div>`;

            newAvatar = `
                <div class="message-box__chat--avatar">
                    <img src=${photoUrl} alt="Avatar" id="avatar">
                </div>
            `;
        }

        if (newChat.getAttribute("class") == "message-box__chat--outgoing") {
            newChat.innerHTML = `
            ${newContent}
            ${htmlImages}
            ${newAvatar}
        `;
        } else {
            newChat.innerHTML = `
            ${newAvatar}
            ${newContent}
            ${htmlImages}
        `;
        }

        // zoom image
        new Viewer(newChat);

        boxChat.appendChild(newChat);
        topScroll();
    });
}
// End show message

// show avatar 
const sideBarAvatar = document.querySelector("[sidebar-avatar]");
if (sideBarAvatar) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const photoURL = user.photoURL;
            if (photoURL) {
                const newAvatar = `
                    <img alt="Avatar" src="${photoURL}" >
                `;

                sideBarAvatar.innerHTML = newAvatar;
            }
        }
    });
}
// End show avatar 


// show user
const listUser = document.querySelector("[list-user]");
const quantityUser = document.querySelector("[quantity-user]");
if (listUser) {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        // Xóa danh sách hiện tại trước khi hiển thị lại
        listUser.innerHTML = "";

        const userId = auth.currentUser.uid;
        let currentUserElement = null;
        let userCount = 0; // Biến đếm số lượng người dùng

        // Duyệt qua tất cả người dùng
        snapshot.forEach((data) => {
            const key = data.key;
            let photoUrl = data.val().photoURL;
            let fullName = data.val().fullName;
            const state = data.val().state;

            userCount++; // Tăng biến đếm mỗi khi duyệt qua một người dùng

            // Kiểm tra nếu là người dùng hiện tại
            if (key === userId) {
                fullName += "(Tôi)";
            }

            // Tạo avatar mặc định nếu không có ảnh
            if (!photoUrl) {
                photoUrl = generateAvatar(`${getFirstLetter(fullName)}`, "white", "#264cca");
            }

            // Tạo phần tử giao diện người dùng
            const user = document.createElement("div");
            const avatarClass = state === "online" ? "online" : "";
            user.setAttribute("class", "message-panel__massage-list--item");
            user.innerHTML = `
            <div class="message-panel__massage-list--item__avatar ${avatarClass}">
                <img alt="Avatar" src="${photoUrl}">
            </div>
            <div class="massage-panel__massage-list--item__content" id="item__content">
                <div class="message-panel__massage-list--item__user">
                    <div class="message-panel__massage-list--item__user--name">${fullName}</div>
                    <div class="message-panel__massage-list--item__user--time">12m</div>
                </div>
                <div class="message-panel__massage-list--item__content-massage">
                    Welcome to my chat app! <span>🔥</span>
                </div>
            </div>
            `;

            // Nếu là người dùng hiện tại, lưu phần tử riêng
            if (key === userId) {
                currentUserElement = user;
            } else {
                // Thêm người dùng khác vào danh sách
                listUser.appendChild(user);
            }
        });

        // Hiển thị số lượng người dùng
        if (quantityUser) {
            quantityUser.innerHTML = `${userCount + 1}`;
        }

        // Thêm người dùng hiện tại lên đầu danh sách
        if (currentUserElement) {
            listUser.prepend(currentUserElement);

            // Tạo phần tử #Chat Chung
            const lastMessage = localStorage.getItem("lastMessage");
            const { fullName, lastContent } = JSON.parse(lastMessage);
            const chatRoomElement = document.createElement("div");
            chatRoomElement.setAttribute("class", "message-panel__massage-list--item");
            chatRoomElement.innerHTML = `
                <div class="message-panel__massage-list--item__avatar">
                    <img alt="Avatar" src="assets/images/icon-1.svg">
                </div>
                <div class="massage-panel__massage-list--item__content" id="item__content">
                    <div class="message-panel__massage-list--item__user">
                        <div class="message-panel__massage-list--item__user--name">#Chat Chung</div>
                        <div class="message-panel__massage-list--item__user--time">...</div>
                    </div>
                    <div class="message-panel__massage-list--item__content-massage" update-content>
                        ${fullName}: ${lastContent}
                    </div>
                </div>
            `;

            // Chèn phần tử #Chat Chung vào vị trí thứ 2
            if (listUser.children.length > 1) {
                listUser.insertBefore(chatRoomElement, listUser.children[1]);
            } else {
                listUser.appendChild(chatRoomElement);
            }
        }
    });

    const chatsRef = ref(db, 'chats');
    onValue(chatsRef, (snapshot) => {
        // const listContent = [];
        // const listName = [];
        const listImages = [];
        const listData = [];
        // Duyệt qua tất cả tin nhắn
        snapshot.forEach((data) => {
            // const content = data.val().content;
            // const fullName = data.val().fullName;
            const images = data.val().images;
            // listContent.push(content);
            // listName.push(fullName);
            if (images && images.length > 0) {
                listImages.push(images);
            }
            listData.push(data.val());
        });


        let lastContent = "";
        if (listData[listData.length - 1].content) {
            lastContent = listData[listData.length - 1].content;

        } else if (listData[listData.length - 1].images) {
            lastContent = "Đã gửi ảnh";
        } else {
            lastContent = "Không có tin nhắn";
        }
        const fullName = listData[listData.length - 1].fullName;

        const html = `${fullName}: ${lastContent}`;

        // Gán nội dung cho phần tử update-content
        const updateContent = document.querySelector("[update-content]");
        if (updateContent) {
            updateContent.innerHTML = html;
        }

        // Lưu trữ tên và tin nhắn vào localStorage dưới dạng JSON
        const messageData = {
            fullName: fullName,
            lastContent: lastContent
        };
        localStorage.setItem("lastMessage", JSON.stringify(messageData));

        // get images and download images
        const listFileDirectory = document.querySelector("[list-file-directory]");
        const countImage = document.querySelector("[count-image]");
        const imageElement = [];
        let count = 0;
        if (listFileDirectory) {
            listImages.forEach((images) => {
                images.forEach((image) => {
                    count++;
                    imageElement.push(`
                        <div class="directory__body--file-pdf">
                            <div class="directory__body--file-pdf--image">
                                <img src=${image} alt="image">
                            </div>

                            <div class="directory__body--file-pdf--content">
                                Image ${count}
                            </div>

                            <div class="directory__body--file-pdf--button" 
                            image-link=${image}
                            >
                                <i class="fa-solid fa-download"></i>
                            </div>
                        </div>
                        `);
                });
            });
        }
        listFileDirectory.innerHTML = imageElement.join("");
        countImage.innerHTML = count;

        // download images
        const buttonDownload = document.querySelectorAll("[image-link]");
        if (buttonDownload.length > 0) {
            buttonDownload.forEach(button => {
                button.addEventListener("click", () => {
                    let imageLink = button.getAttribute("image-link");

                    if (imageLink) {
                        imageLink = addAttachmentParam(imageLink); 
                        const updatedUrl = convertHttpToHttps(imageLink);

                        const a = document.createElement("a");
                        a.href = updatedUrl;
                        a.download = "image";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        console.error("Không tìm thấy link ảnh.");
                    }
                });
            })
        }
    });
}
// End show user


// show emoji
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const buttonIcon = document.querySelector('.button-icon');
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener('click', () => {
        tooltip.classList.toggle('shown');
    });

    const inputChat = document.querySelector(".chat-app [form-chat] input[name='content']");
    emojiPicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode;
        inputChat.value += icon;
    });

    document.addEventListener('click', event => {
        if (!emojiPicker.contains(event.target) && !buttonIcon.contains(event.target)) {
            tooltip.classList.remove('shown');
        }
    });
}
// End show emoji


// show list images and download images

// end show list images and download images