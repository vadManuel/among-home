import React from 'react'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
// import doStuff from 'doStuff/stuff'

import useSound from 'use-sound'

import doStuff from 'doStuff/doStuff'

import reactor from 'stuff/reactor.png'
import o2 from 'stuff/o2.png'
import body_reported from 'stuff/body_reported.png'
import emergency_meeting from 'stuff/emergency_meeting.png'
import pressed_report from 'stuff/pressed_report.png'
import report from 'stuff/report.png'
import pressed_emergency from 'stuff/pressed_emergency.png'
import emergency from 'stuff/emergency.png'
import kill from 'stuff/kill.png'

import emergency_sound from 'stuff/emergency.mp3'
import reactor_sound from 'stuff/reactor.mp3'
import body_reported_sound from 'stuff/body_reported.mp3'

// import { todo, working, done } from 'seeStuff/colorStuff'
import { useSelector } from 'react-redux'

import Countdown from 'react-countdown'

let timers = [60, 45, 180]
timers = timers.map((t,i) => i !== 0 ? t + timers[i-1] : t)

const timerLabels = ['Go to the discussion table', 'Discussion time', 'Voting time']

function GameTime(props:any) {
	const [playEmergency] = useSound(emergency_sound)
	const [playReport] = useSound(body_reported_sound)
	const [playReactor] = useSound(reactor_sound)

	const [reports, emergencies, o2_sabotages, reactor_sabotages] = useSelector(state => [
		state.firestore.ordered.reports,
		state.firestore.ordered.emergencies,
		state.firestore.ordered.o2,
		state.firestore.ordered.reactor
	])

	const [currentTimer, setCurrentTimer] = React.useState(0)
	const [sabotage, setSabotage] = React.useState(null)
	const [isUltraTouched, setUltraTouched] = React.useState(null)
	const [isSuperTouched, setSuperTouched] = React.useState(null)
	const [isTouched, setTouched] = React.useState(false)
	const [isOpen, setOpen] = React.useState(false)

	const [latest, setLatest] = React.useState(false)
	// const [id, setId] = React.useState(null)

	const [readyKill, setKill ] = React.useState(moment())

	React.useEffect(() => {
		if (reports || emergencies || o2_sabotages || reactor_sabotages) {
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

				if (reactor_sabotages && reactor_sabotages[0] && reactor_sabotages[0].time) {
					const latestReactor = moment(reactor_sabotages[0].time.toDate())
					if (latest.isBefore(latestReactor)) {
						playReactor()
						// setId(reactor_sabotages[0].id)
						setLatest(moment(reactor_sabotages[0].time.toDate()))
						setSabotage('reactor')
					}
				}

				if (o2_sabotages && [0] && o2_sabotages[0].time) {
					const latestReactor = moment(o2_sabotages[0].time.toDate())
					if (latest.isBefore(latestReactor)) {
						playReactor()
						// setId(o2_sabotages[0].id)
						setLatest(moment(o2_sabotages[0].time.toDate()))
						setSabotage('o2')
					}
				}
			} else {
				setLatest(moment())
			}
		}
	}, [reports, emergencies, o2_sabotages, reactor_sabotages, latest, playEmergency, playReport, playReactor])

	const handleTouch = React.useCallback((whatTouch) => {
		if (['o2','reactor'].includes(whatTouch))
			setOpen(false)

		setSuperTouched(whatTouch)
		setTouched(whatTouch)

		doStuff(whatTouch)
			.catch((error) => console.log(error))
			.finally(() => setSuperTouched(null))
	}, [])

	const handleOpen = React.useCallback(() => {
		setOpen(!isOpen)
	}, [isOpen, setOpen])

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
								setKill(moment())
							} else {
								setCurrentTimer(currentTimer+1)
							}
						}}
						renderer={props => (
							<>
								<div style={{ color: 'white', textAlign: 'center' }}>
									{`${timerLabels[currentTimer]}`}<br /><span style={{ fontSize: '1.5rem' }}>{`${Math.trunc(props.total/1000)}`}</span>
								</div>
								<div style={{ height: '2.5rem', width: '100%' }}>
									{currentTimer === 2 && <button onClick={() => {
										setCurrentTimer(0)
										setUltraTouched(null)
										setKill(moment())
									}} style={{ height: '100%', width: '40%', margin: '20px 30%', borderRadius: '5px', backgroundColor: 'white', border: 0 }}>Done</button>}
								</div>
							</>
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
			<Grid item sm={6} style={{ height: '50%', width: '100%' }}>
				{sabotage === 'o2' ?
					<div style={{ color: 'white', width: '100%', textAlign: 'center' }}>
						<span style={{ fontSize: '1.8rem' }}>Emergency</span><br/>
						<span style={{ fontSize: '1.3rem', color: 'lightblue' }}>O2 generator malfunction!</span>
						<Countdown
							overtime={true}
							date={latest + 70*1000}
							onComplete={() => {
								setSabotage('fail')
							}}
							renderer={props => (
								<>
									<div style={{ color: 'white', textAlign: 'center' }}>
										<span style={{ fontSize: '1.5rem', color: 'lightblue' }}>{`${Math.trunc(props.total/1000)}`}</span>
									</div>
									<div style={{ height: '2.5rem', width: '100%' }}>
										<button onClick={() => {
											setSabotage(null)
										}} style={{ height: '100%', width: '40%', margin: '20px 30%', borderRadius: '5px', backgroundColor: 'white', border: 0 }}>Fixed</button>
									</div>
								</>
							)}
						/>
					</div>
					: (
						sabotage === 'reactor' ?
							<div style={{ color: 'white', width: '100%', textAlign: 'center' }}>
								<span style={{ fontSize: '1.8rem' }}>Emergency</span><br/>
								<span style={{ fontSize: '1.3rem', color: 'tomato' }}>Reactor meltdown in progress!</span>
								<Countdown
									overtime={true}
									date={latest + 45*1000}
									onComplete={() => {
										setSabotage('fail')
									}}
									renderer={props => (
										<>
											<div style={{ color: 'white', textAlign: 'center' }}>
												<span style={{ fontSize: '1.5rem', color: 'tomato' }}>{`${Math.trunc(props.total/1000)}`}</span>
											</div>
											<div style={{ height: '2.5rem', width: '100%' }}>
												<button onClick={() => {
													setSabotage(null)
												}} style={{ height: '100%', width: '40%', margin: '20px 30%', borderRadius: '5px', backgroundColor: 'white', border: 0 }}>Fixed</button>
											</div>
										</>
									)}
								/>
							</div>
						: sabotage === 'fail' ?
							<div style={{ color: 'white', width: '100%', textAlign: 'center' }}>
								<br/><br/>
								<span style={{ fontSize: '1.8rem', color: 'tomato' }}>Impostors win</span>
							</div>
						: null
					)
				}
				{props.role === 'impostor' && <button style={{ height: '100%', width: '100%', backgroundColor: 'transparent', border: 0, outline: 'none' }} onClick={() => sabotage ? setSabotage(null) : handleOpen()}></button>}
				{isOpen && (
					readyKill === true
					? <div style={{ color: 'tomato', textAlign: 'center', fontSize: '1.8rem' }}>Ready to kill</div>
					: <div>
						<Countdown
							overtime={true}
							date={readyKill + 30*1000}
							onTick={() => {
								// if () {

								// }
							}}
							onComplete={() => {
								setKill(true)
							}}
							renderer={props => (
								<div style={{ color: 'white', textAlign: 'center', fontSize: '1.8rem' }}>
									{`Kill cooldown ${Math.trunc(props.total/1000)}s`}
								</div>
							)}
						/>
					</div>
				)}
			</Grid>
			
			<Grid item>
				<Grid container justify='space-between' style={{ minHeight: '30vh' }}>
					{isOpen
						? <>
						<Grid
							container
							item
							xs={4}
							justify='center'
							alignItems='center'
							onTouchStart={() => handleTouch('reactor')}
							onTouchEnd={() => setTouched(false)}
							onTouchCancel={() => setTouched(false)}
						>
							<img
								className='nopointer'
								src={reactor}
								draggable={false}
								onSelect={() => null}
								style={{
									paddingTop: '1rem',
									paddingBottom: '1rem',
									marginRight: -16,
									maxWidth: [isTouched, isSuperTouched].includes('reactor') ? '34vw' : '30vw',
									height: 'auto',
								}}
							/>
						</Grid>
						<Grid
							container
							item
							xs={4}
							justify='center'
							alignItems='center'
							onTouchStart={() => handleTouch('o2')}
							onTouchEnd={() => setTouched(false)}
							onTouchCancel={() => setTouched(false)}
						>
							<img
								className='nopointer'
								src={o2}
								draggable={false}
								onSelect={() => null}
								style={{
									paddingTop: '1rem',
									paddingBottom: '1rem',
									marginRight: -16,
									maxWidth: [isTouched, isSuperTouched].includes('o2') ? '34vw' : '30vw',
									height: 'auto',
								}}
							/>
						</Grid>
						<Grid
							container
							item
							xs={4}
							justify='center'
							alignItems='center'
							onTouchStart={() => {
								if (readyKill === true) {
									setTouched('kill')
									setKill(moment())
								}
							}}
							onTouchEnd={() => setTouched(false)}
							onTouchCancel={() => setTouched(false)}
						>
							<img
								className='nopointer'
								src={kill}
								draggable={false}
								onSelect={() => null}
								style={{
									paddingTop: '1rem',
									paddingBottom: '1rem',
									marginRight: -16,
									maxWidth: [isTouched, isSuperTouched].includes('kill') ? '30vw' : '26vw',
									height: 'auto',
								}}
							/>
						</Grid>
						</>
						: <>
						<Grid
							container
							item
							xs={6}
							justify='center'
							alignItems='center'
							onTouchStart={() => sabotage === 'fail' ? null : handleTouch('reports')}
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
							onTouchStart={() => { sabotage ? null : handleTouch('emergencies') }}
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
					</>}
				</Grid>
			</Grid>
		</Grid>
	)
}

export default GameTime
