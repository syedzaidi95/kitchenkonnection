import firebase from '../../config/firebase';
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();

export const logout = () => {

}

export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password).then((e) => {
            let uid = e.user.uid
            database.ref(`users/${uid}`).once('value').then((e) => {
                resolve(e.val())
            })
        }).catch(e => {
            reject(e)
        })
    })
}


export const signUp = (email, password, name, number, type) => {
    return new Promise((resolve, reject) => {
        auth.createUserWithEmailAndPassword(email, password).then(e => {
            let uid = e.user.uid
            database.ref(`users/${uid}`).set({ email, name, number, type, uid }).then(() => {
                resolve(`Dear ${name} user created, now you can login with email and password`)
            })
        }).catch(e => {
            reject(e)
        });
    })
}

export const signUpWithSocial = (provider, type) => {

    return new Promise((resolve, reject) => {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            let obj = {
                name: user.displayName,
                image: user.photoURL,
                email: user.email,
                number: user.phoneNumber,
                uid: user.uid,
                type
            }
            database.ref(`users/${obj.uid}`).set(obj).then(() => {
                resolve(obj)
            })
        }).catch(function (error) {
            reject(error)
        });
    })
}