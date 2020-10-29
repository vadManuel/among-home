import React from 'react'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
// import doStuff from 'doStuff/stuff'

import useSound from 'use-sound'

import doStuff from 'doStuff/doStuff'

import body_reported from 'stuff/body_reported.png'
import emergency_meeting from 'stuff/emergency_meeting.png'
import pressed_report from 'stuff/pressed_report.png'
import report from 'stuff/report.png'
import pressed_emergency from 'stuff/pressed_emergency.png'
import emergency from 'stuff/emergency.png'

import emergency_sound from 'stuff/emergency.mp3'
import body_reported_sound from 'stuff/body_reported.mp3'

import { todo, working, done } from 'seeStuff/colorStuff'
import { useSelector } from 'react-redux'

import Countdown from 'react-countdown'

const timers = [30, 45, 120]
const timerLabels = ['Go to the discussion table', 'Discussion time', 'Voting time']

function GameTime() {
	const [playEmergency] = useSound(emergency_sound)
	const [playReport] = useSound(body_reported_sound)

	const [reports, emergencies, o2_sabotages, reactor_sabotages] = useSelector(state => [
		state.firestore.ordered.reports,
		state.firestore.ordered.emergencies,
		state.firestore.ordered.o2_sabotages,
		state.firestore.ordered.reactor_sabotages
	])

	const [currentTimer, setCurrentTimer] = React.useState(0)
	const [isUltraTouched, setUltraTouched] = React.useState(null)
	const [isSuperTouched, setSuperTouched] = React.useState(null)
	const [isTouched, setTouched] = React.useState(false)

	const [latest, setLatest] = React.useState(false)

	React.useEffect(() => {
		if (reports || emergencies) {
			if (latest) {
				if (reports && reports[0] && reports[0].time) {
					const latestReport = moment(reports[0].time.toDate())
					if (latest.isBefore(latestReport)) {
						playReport()
						setLatest(moment(reports[0].time.toDate()))
						setUltraTouched('reports')
					}
				}
				
				if (emergencies && emergencies[0] && emergencies[0].time) {
					const latestEmergency = moment(emergencies[0].time.toDate())
					if (latest.isBefore(latestEmergency)) {
						playEmergency()
						setLatest(moment(emergencies[0].time.toDate()))
						setUltraTouched('emergencies')
					}
				}
			} else {
				setLatest(moment())
			}
		}
	}, [reports, emergencies, o2_sabotages, reactor_sabotages, latest, playEmergency, playReport])

	const handleTouch = React.useCallback((whatTouch) => {
		setSuperTouched(whatTouch)
		setTouched(whatTouch)

		doStuff(whatTouch)
			.catch((error) => console.log(error))
			.finally(() => setSuperTouched(null))
	}, [])

	if (isUltraTouched)
		return (
			<Grid
				container
				direction='column'
				justify='center'
				style={{ height: '85%', paddingTop: '2.5rem' }}
			>
				<Grid item>
					<img
						className='nopointer'
						src={isUltraTouched === 'reports' ? body_reported : emergency_meeting}
						style={{
							maxWidth: '100vw',
							height: 'auto'
						}}
					/>
				</Grid>	
				<Grid item>
					<Countdown
						overtime={true}
						date={latest + timers[currentTimer]*1000}
						onComplete={() => {
							if (currentTimer === 2) {
								setCurrentTimer(0)
								setUltraTouched(null)
							} else {
								setCurrentTimer(currentTimer+1)
							}
						}}
						renderer={props => (
							<div style={{ color: 'white', textAlign: 'center' }}>
								{`${timerLabels[currentTimer]}`}<br /><span style={{ fontSize: '1.5rem' }}>{`${Math.trunc(props.total/1000)}`}</span>
							</div>
						)}
					/>
				</Grid>
			</Grid>
		)

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
						onTouchStart={() => handleTouch('reports')}
						onTouchEnd={() => setTouched(false)}
						onTouchCancel={() => setTouched(false)}
					>
						<img
							className='nopointer'
							src={[isTouched, isSuperTouched].includes('reports') ? pressed_report : report}
							draggable={false}
							onSelect={() => null}
							style={{
								paddingTop: '1rem',
								paddingBottom: '1rem',
								marginRight: -16,
								maxWidth: [isTouched, isSuperTouched].includes('reports') ? '38vw' : '35vw',
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
						onTouchStart={() => handleTouch('emergencies')}
						onTouchEnd={() => setTouched(false)}
						onTouchCancel={() => setTouched(false)}
					>
						<img
							className='nopointer'
							src={[isTouched, isSuperTouched].includes('emergencies') ? pressed_emergency : emergency}
							style={{
								paddingTop: '1rem',
								paddingBottom: '1rem',
								marginLeft: -16,
								maxWidth: [isTouched, isSuperTouched].includes('emergencies') ? '48vw' : '45vw',
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
