import React from 'react'

import NewGame from 'seeStuff/NewGame'
import GameTime from 'seeStuff/GameTime'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'


function App() {
	const a = false

	return (
		<div className='app'>
			{a ? <NewGame /> : <GameTime />}
		</div>
	)
}

export default compose(firestoreConnect(() => [
	{ collection: 'reports', orderBy: ['time', 'desc'] },
	{ collection: 'emergencies', orderBy: ['time', 'desc'] },
	{ collection: 'o2_sabotages', orderBy: ['time', 'desc'] },
	{ collection: 'reactor_sabotages', orderBy: ['time', 'desc'] }
]))(App)
