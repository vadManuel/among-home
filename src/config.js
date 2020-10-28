import firebase from 'firebase/app'
import 'firebase/firestore'
import { combineReducers, createStore } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'

const primary = firebase.initializeApp({
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID,
})

primary
	.firestore()
	.enablePersistence({ synchronizeTabs: true })
	.catch((error) => console.log('Persistence initialization error:', error))

const rootReducer = combineReducers({
	firebase: firebaseReducer,
	firestore: firestoreReducer
})

const store = createStore(rootReducer)

const rrfProps = {
	firebase,
	config: {
		userProfile: 'users',
		useFirestoreForProfile: true
	},
	dispatch: store.dispatch,
	createFirestoreInstance,
}

export { store, rrfProps }
