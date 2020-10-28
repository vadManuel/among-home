import React from 'react'
import Grid from '@material-ui/core/Grid'
// import doStuff from 'doStuff/stuff'

import pressed_report from 'stuff/pressed_report.png'
import report from 'stuff/report.png'
import pressed_emergency from 'stuff/pressed_emergency.png'
import emergency from 'stuff/emergency.png'

import { todo, working, done } from 'seeStuff/colorStuff'


function GameTime() {
	const [isTouched, setTouched] = React.useState(false)

	return (
		<Grid
			container
			direction='column'
			justify='space-between'
			style={{ height: '85%', paddingTop: '2.5rem' }}
		>
			<Grid item sm={6} style={{ width: '90%' }}>
				<div
					style={{
						...todo,
						backgroundColor: 'rgba(200,200,200,.4)',
						textAlign: 'center',
						width: '5rem',
						marginBottom: 0,
					}}
				>
					Tasks
				</div>
				<Grid
					container
					style={{
						backgroundColor: 'rgba(200,200,200,.4)',
						paddingTop: 7,
						paddingBottom: 7,
						marginTop: 0,
						listStyleType: 'none',
						paddingLeft: '1.5rem',
						width: '100%',
					}}
				>
					<Grid item xs={12}>
						<Grid container justify='space-between'>
							<Grid item style={working}>
								Navigation: Accept Diverted Power
							</Grid>
							<Grid item style={{ paddingRight: '1rem' }}>
								<input type='checkbox' />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify='space-between'>
							<Grid item style={working}>
								Admin: Upload Data (1/2)
							</Grid>
							<Grid item style={{ paddingRight: '1rem' }}>
								<input type='checkbox' checked={true} />
								<input type='checkbox' />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify='space-between'>
							<Grid item style={done}>
								Cafeteria: Fix Wiring (3/3)
							</Grid>
							<Grid item style={{ paddingRight: '1rem' }}>
								<input type='checkbox' checked={true} />
								<input type='checkbox' checked={true} />
								<input type='checkbox' checked={true} />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify='space-between'>
							<Grid item style={todo}>
								Electrical: Calibrate Distributor
							</Grid>
							<Grid item style={{ paddingRight: '1rem' }}>
								<input type='checkbox' />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container justify='space-between' style={{ minHeight: '30vh' }}>
					<Grid
						container
						item
						xs={6}
						justify='center'
						alignItems='center'
						onTouchStart={() => setTouched('report')}
						onTouchEnd={() => setTouched(false)}
						onTouchCancel={() => setTouched(false)}
					>
						<img
							className='nopointer'
							src={isTouched === 'report' ? pressed_report : report}
							draggable={false}
							onSelect={() => null}
							style={{
								paddingTop: '1rem',
								paddingBottom: '1rem',
								marginRight: -16,
								maxWidth: isTouched === 'report' ? '38vw' : '35vw',
								height: 'auto',
							}}
						/>
					</Grid>
					<Grid
						container
						item
						xs={6}
						justify='center'
						alignItems='center'
						onTouchStart={() => setTouched('emergency')}
						onTouchEnd={() => setTouched(false)}
						onTouchCancel={() => setTouched(false)}
					>
						<img
							className='nopointer'
							src={isTouched === 'emergency' ? pressed_emergency : emergency}
							style={{
								paddingTop: '1rem',
								paddingBottom: '1rem',
								marginLeft: -16,
								maxWidth: isTouched === 'emergency' ? '48vw' : '45vw',
								height: 'auto',
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default GameTime
