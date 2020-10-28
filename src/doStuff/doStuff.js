import firebase from 'firebase/app'

const doStuff = thisStuff =>
	new Promise((resolve, reject) => {
		const data = {
			time: firebase.firestore.FieldValue.serverTimestamp(),
		}

		return firebase
			.firestore()
			.collection(thisStuff)
			.add(data)
			.then(() => resolve(data))
			.catch((error) => reject(error))
    })

export default doStuff