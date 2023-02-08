import { signInWithPopup, GoogleAuthProvider, getAuth } from '<https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js>'

const signInGoogleButton = document.getElementById('sign-in');

export function authenticateWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        signInWithPopup(auth, provider)
                .then(function (result) {
                        window.location.href = '../index.html';
                        console.log('working', result)
                })
                .catch(function (error) {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        const email = error.email;
                        const credential = error.credential;
                        console.log(errorCode, errorMessage, email, credential);
                });
}

signInGoogleButton.addEventListener('click', authenticateWithGoogle);