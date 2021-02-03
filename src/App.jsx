import React from 'react'

// import NewGame from 'seeStuff/NewGame'
import GameTime from 'seeStuff/GameTime'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import Grid from '@material-ui/core/Grid'


function App() {
	const [role, setRole] = React.useState(null)
	return (
		<div className='app'>
			{!role ? <Grid container style={{ height: '90%' }} direction='column' justify='center'>
				<Grid item>
					<div style={{ height: '2.5rem', width: '100%' }}>
						<button onClick={() => setRole('crewmate')} style={{ height: '100%', width: '80%', margin: '20px 10%', borderRadius: '5px', backgroundColor: 'white', border: 0 }}>Crewmate</button>
						<button onClick={() => setRole('impostor')} style={{ height: '100%', width: '80%', margin: '20px 10%', borderRadius: '5px', backgroundColor: 'tomato', border: 0 }}>Impostor</button>
					</div>
				</Grid>
			</Grid> :
			<GameTime role={role} />
			}
		</div>
	)
}

export default compose(firestoreConnect(() => [
	{ collection: 'reports', orderBy: ['time', 'desc'] },
	{ collection: 'emergencies', orderBy: ['time', 'desc'] },
	{ collection: 'o2', orderBy: ['time', 'desc'] },
	{ collection: 'reactor', orderBy: ['time', 'desc'] }
]))(App)
