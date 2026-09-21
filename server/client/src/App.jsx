import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const demoAccounts = [
    { label: 'Administrator', email: 'admin', password: 'Admin123!', role: 'admin' },
    { label: 'Police officer', email: 'policeofficer', password: 'Officer123!', role: 'police_officer' },
    { label: 'Judicial authority', email: 'judicialauthority', password: 'Judge123!', role: 'judicial_authority' },
    { label: 'Inspectorate', email: 'inspectorate', password: 'Inspector123!', role: 'general_inspectorate' },
]
const emptyDashboard = { stats: {}, charts: {}, recentActivity: [] }
const navItems = [
    ['overview', 'Overview', '◈'], ['cases', 'Case files', '▤'], ['persons', 'Persons of interest', '◎'],
    ['records', 'Criminal records', '▥'], ['alerts', 'Wanted alerts', '🚨'],
]
const roleHome = { admin: 'overview', police_officer: 'cases', judicial_authority: 'alerts', general_inspectorate: 'audit' }
const offlineSeed = { cases: [], persons: [], records: [], alerts: [], users: [], audit: [] }
const alertReasons = ['Arrest warrant', 'Court conviction', 'Serious criminal offence', 'Fugitive suspect', 'Dangerous wanted suspect', 'Missing person linked to a crime', 'Other']
const regionOptions = ['Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'North-West', 'South', 'South-West', 'West']

function getOfflineData() {
    return JSON.parse(localStorage.getItem('pcrs_offline_data') || JSON.stringify(offlineSeed))
}

function saveOfflineData(data) {
    localStorage.setItem('pcrs_offline_data', JSON.stringify(data))
}

function cacheOfflineCollection(collection, records) {
    const data = getOfflineData()
    data[collection] = records || []
    saveOfflineData(data)
}

function filterOfflineRows(rows, query) {
    if (!query) return rows
    const normalized = query.toLowerCase()
    return rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(normalized)))
}

function getStoredNotifications() {
    return JSON.parse(localStorage.getItem('pcrs_notifications') || '[]')
}

function storeNotification(notification) {
    const existing = getStoredNotifications()
    const duplicate = existing.some((item) => item.alert?.id === notification.alert?.id && item.action === notification.action)
    if (duplicate) return
    localStorage.setItem('pcrs_notifications', JSON.stringify([notification, ...existing].slice(0, 30)))
}

async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error || 'The request could not be completed.')
    return payload
}

function App() {
    const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('pcrs_session') || 'null'))
    const [credentials, setCredentials] = useState(demoAccounts[0])
    const [activeView, setActiveView] = useState(() => roleHome[JSON.parse(localStorage.getItem('pcrs_session') || 'null')?.user?.role] || 'overview')
    const [dashboard, setDashboard] = useState(emptyDashboard)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [search, setSearch] = useState('')
    const [wantedOnly, setWantedOnly] = useState(false)
    const [form, setForm] = useState(null)
    const [notifications, setNotifications] = useState(() => getStoredNotifications())
    const [showNotifications, setShowNotifications] = useState(false)
    const [selectedPerson, setSelectedPerson] = useState(null)
    const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem('pcrs_offline_mode') === 'true')

    useEffect(() => { if (session) loadView(activeView, wantedOnly) }, [session, activeView, offlineMode, wantedOnly])

    useEffect(() => {
        if (!session) {
            setNotifications([])
            return undefined
        }
        if (offlineMode) return undefined
        const socket = io(window.location.origin, { auth: { token: session.token } })
        socket.on('notification', (notification) => {
            storeNotification(notification)
            setNotifications(getStoredNotifications())
        })
        const onStorage = (event) => {
            if (event.key === 'pcrs_notifications') setNotifications(getStoredNotifications())
        }
        window.addEventListener('storage', onStorage)
        return () => { socket.disconnect(); window.removeEventListener('storage', onStorage) }
    }, [session, offlineMode])

    const headers = session ? { Authorization: `Bearer ${session.token}` } : {}
    const canWrite = ['admin', 'police_officer'].includes(session?.user.role)
    const canReviewAlerts = ['admin', 'judicial_authority'].includes(session?.user.role)
    const canManage = ['admin', 'general_inspectorate'].includes(session?.user.role)

    async function loadView(view = activeView, onlyWanted = wantedOnly) {
        if (!session) return
        if (offlineMode) {
            const data = getOfflineData()
            if (view === 'overview') setDashboard({ stats: { totalCases: data.cases.length, openCases: data.cases.length, wantedPersons: data.persons.filter((person) => person.is_wanted).length, pendingAlerts: data.alerts.filter((alert) => alert.status === 'pending').length }, charts: {}, recentActivity: [] })
            if (view !== 'overview') {
                const sourceRows = view === 'persons' && onlyWanted ? (data.persons || []).filter((person) => person.is_wanted) : data[view] || []
                setRows(filterOfflineRows(sourceRows, search))
            }
            return
        }
        setLoading(true); setError('')
        try {
            if (view === 'overview') setDashboard(await api('/api/reports/dashboard', { headers }))
            if (view === 'cases') { const result = (await api(`/api/cases?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`, { headers })).cases; cacheOfflineCollection('cases', result); setRows(result) }
            if (view === 'persons') { const result = (await api(`/api/persons?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}${onlyWanted ? '&wanted=true' : ''}`, { headers })).persons; cacheOfflineCollection('persons', result); setRows(result) }
            if (view === 'records') { const result = (await api(`/api/records?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`, { headers })).records; cacheOfflineCollection('records', result); setRows(result) }
            if (view === 'alerts') { const result = (await api(`/api/alerts?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`, { headers })).alerts; cacheOfflineCollection('alerts', result); setRows(result) }
            if (view === 'users') { const result = (await api(`/api/users?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`, { headers })).users; cacheOfflineCollection('users', result); setRows(result) }
            if (view === 'audit') { const result = (await api('/api/audit?limit=50', { headers })).logs; cacheOfflineCollection('audit', result); setRows(result) }
        } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
    }

    async function login(event) {
        event.preventDefault(); setLoading(true); setError('')
        try {
            const nextSession = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
            if (credentials.role && credentials.role !== nextSession.user.role) throw new Error('This account does not have the selected user role.')
            localStorage.setItem('pcrs_session', JSON.stringify(nextSession)); setActiveView(roleHome[nextSession.user.role] || 'overview'); setSession(nextSession)
        } catch (requestError) {
            if (!navigator.onLine || requestError instanceof TypeError) {
                loginOffline()
            } else {
                setError(requestError.message)
            }
        } finally { setLoading(false) }
    }

    function loginOffline() {
        const offlineSession = { token: 'offline-session', user: { first_name: 'Offline', last_name: 'Officer', role: 'police_officer', region: 'Local station', station: 'Offline station' } }
        localStorage.setItem('pcrs_offline_mode', 'true')
        localStorage.setItem('pcrs_session', JSON.stringify(offlineSession))
        setOfflineMode(true); setActiveView('cases'); setSession(offlineSession); setNotice('Offline workspace active. Changes are stored on this device.')
    }

    async function uploadPersonPhoto(personId, file) {
        if (!personId || !file) return null
        const formData = new FormData()
        formData.append('photo', file)
        const response = await fetch(`/api/persons/${personId}/photo`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.token}` },
            body: formData,
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(payload.error || 'Photo upload failed.')
        return payload
    }

    async function submitForm(event) {
        event.preventDefault(); setLoading(true); setError('')
        const endpoint = form.type === 'case' ? '/api/cases' : form.type === 'person' ? '/api/persons' : form.type === 'record' ? '/api/records' : '/api/alerts'
        try {
            let payload = { ...form.values }
            if (offlineMode) {
                const data = getOfflineData()
                const collection = form.type === 'case' ? 'cases' : form.type === 'person' ? 'persons' : form.type === 'record' ? 'records' : 'alerts'
                const item = { ...payload, id: Date.now(), status: form.type === 'alert' ? 'pending' : 'open', is_wanted: form.type === 'person' ? false : undefined, offline: true }
                data[collection] = [item, ...(data[collection] || [])]
                if (form.type === 'alert' && item.person_id) {
                    data.persons = (data.persons || []).map((person) => person.id === Number(item.person_id) ? { ...person, is_wanted: true } : person)
                }
                saveOfflineData(data)
                const notification = { type: 'wanted_alert', action: 'created', alert: { id: item.id, alert_ref: `OFFLINE-${item.id}`, status: item.status, priority: item.priority, reason: item.reason, person_id: item.person_id }, person: data.persons.find((person) => person.id === item.person_id) || null, created_at: new Date().toISOString() }
                if (form.type === 'alert') {
                    storeNotification(notification); setNotifications(getStoredNotifications()); setShowNotifications(false)
                    setWantedOnly(true); setActiveView('persons'); setNotice('Wanted alert saved. Showing the wanted person list.')
                    await loadView('persons', true)
                } else {
                    setNotice(`${form.type[0].toUpperCase()}${form.type.slice(1)} saved on this device for later sync.`); await loadView(activeView)
                }
                setForm(null)
                return
            }
            const photoFile = form.values.photo_file || null

            if (form.type === 'person') {
                const personResponse = await api(endpoint, {
                    method: 'POST', headers, body: JSON.stringify({
                        ...payload,
                        photo_file: undefined,
                        photo_url: payload.photo_url || '',
                    })
                })
                if (photoFile) await uploadPersonPhoto(personResponse.id, photoFile)
                setForm(null); setNotice('Person registered successfully.'); await loadView(activeView)
                return
            }

            if (form.type === 'alert') {
                const identityHints = [payload.person_id, payload.first_name, payload.last_name, payload.alias, payload.physical_desc, payload.clothing, payload.vehicle, payload.witness_description, payload.photo_file].filter(Boolean)
                if (!payload.person_id && identityHints.length > 0) {
                    const physicalDesc = [payload.physical_desc, payload.clothing, payload.vehicle, payload.witness_description].filter(Boolean).join(' | ')
                    const fallbackPerson = await api('/api/persons', {
                        method: 'POST', headers, body: JSON.stringify({
                            first_name: payload.first_name || 'Unknown',
                            last_name: payload.last_name || 'Suspect',
                            alias: payload.alias || '',
                            gender: payload.gender || 'other',
                            nationality: payload.nationality || 'Cameroonian',
                            address: payload.address || '',
                            physical_desc: physicalDesc || payload.description || '',
                            photo_url: payload.photo_url || '',
                        })
                    })
                    payload.person_id = fallbackPerson.id
                }
                if (!payload.person_id) throw new Error('Add a person ID or at least a physical description, name, alias, clothing detail, or vehicle detail.')

                const combinedDescription = [
                    payload.description,
                    payload.physical_desc,
                    payload.clothing,
                    payload.vehicle,
                    payload.witness_description,
                ].filter(Boolean).join(' | ')

                payload = {
                    person_id: Number(payload.person_id),
                    case_id: payload.case_id ? Number(payload.case_id) : null,
                    reason: payload.reason,
                    priority: payload.priority,
                    description: combinedDescription || 'Unknown suspect alert',
                    last_known_loc: payload.last_known_loc,
                    region: payload.region || session.user.region,
                    station: payload.station || session.user.station,
                }
                if (photoFile) await uploadPersonPhoto(payload.person_id, photoFile)
            }

            const created = await api(endpoint, { method: 'POST', headers, body: JSON.stringify(payload) })
            if (form.type === 'alert') {
                const person = await api(`/api/persons/${created.person_id}`, { headers }).catch(() => null)
                const notification = { type: 'wanted_alert', action: 'created', alert: created, person, created_at: new Date().toISOString() }
                storeNotification(notification); setNotifications(getStoredNotifications()); setShowNotifications(false)
                setWantedOnly(true); setActiveView('persons'); setNotice('Wanted alert submitted. Showing the wanted person list.')
                await loadView('persons', true)
            } else {
                setNotice(`${form.type[0].toUpperCase()}${form.type.slice(1)} registered successfully.`); await loadView(activeView)
            }
            setForm(null)
        } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
    }

    async function alertAction(id, action) {
        if (offlineMode) {
            const data = getOfflineData()
            data.alerts = data.alerts.map((alert) => alert.id === id ? { ...alert, status: action === 'authorize' ? 'authorized' : action === 'reject' ? 'rejected' : action === 'issue' ? 'issued' : 'resolved' } : alert)
            saveOfflineData(data); setNotice(`Alert ${action}d locally. It will need syncing when connected.`); await loadView('alerts'); return
        }
        setLoading(true); setError('')
        try { await api(`/api/alerts/${id}/${action}`, { method: 'PUT', headers }); setNotice(`Alert ${action}d successfully.`); await loadView('alerts') }
        catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
    }

    async function openPersonProfile(id) {
        if (!id) return
        if (offlineMode) { setSelectedPerson(getOfflineData().persons.find((person) => person.id === id) || null); return }
        setLoading(true); setError('')
        try {
            const person = await api(`/api/persons/${id}`, { headers })
            setSelectedPerson(person)
        } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
    }

    function logout() { localStorage.removeItem('pcrs_session'); localStorage.removeItem('pcrs_offline_mode'); setOfflineMode(false); setSession(null); setDashboard(emptyDashboard) }
    function changeView(view) { setSearch(''); setNotice(''); setWantedOnly(false); setActiveView(view) }

    if (!session) return <Login credentials={credentials} setCredentials={setCredentials} onSubmit={login} onOfflineLogin={loginOffline} loading={loading} error={error} />
    const title = activeView === 'overview' ? 'National overview' : activeView === 'cases' ? 'Case files' : activeView === 'persons' ? 'Persons of interest' : activeView === 'records' ? 'Criminal records' : activeView === 'alerts' ? 'Wanted alerts' : activeView === 'users' ? 'User administration' : 'Audit trail'
    return <div className="app-shell">
        <aside className="sidebar"><div className="brand"><span className="brand-mark">CR</span><span><strong>National</strong><small>Criminal Records</small></span></div><p className="eyebrow">Operations console</p><nav>{navItems.map(([value, label, icon]) => <button className={activeView === value ? 'nav-item active' : 'nav-item'} key={value} onClick={() => changeView(value)}><span className="nav-icon">{icon}</span>{label}</button>)}{canManage && <><p className="nav-section">Governance</p><button className={activeView === 'users' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('users')}><span className="nav-icon">♙</span>Users</button><button className={activeView === 'audit' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('audit')}><span className="nav-icon">⌁</span>Audit trail</button></>}</nav><div className="sidebar-note"><span className="status-dot" />Secure network<br /><small>10 regional delegations connected</small></div></aside>
        <main className="main-content"><header className="topbar"><div><p className="eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><h1>{title}</h1></div><div className="profile"><div className="notification-wrap"><button className="notification-button" aria-label="Notifications" onClick={() => setShowNotifications((visible) => !visible)}>⌁{notifications.length > 0 && <span className="notification-count">{notifications.length > 9 ? '9+' : notifications.length}</span>}</button>{showNotifications && <NotificationPanel notifications={notifications} onClear={() => setNotifications([])} />}</div><span className="avatar">{session.user.first_name[0]}{session.user.last_name[0]}</span><span><strong>{session.user.first_name} {session.user.last_name}</strong><small>{session.user.role.replaceAll('_', ' ')}</small></span><button className="logout" onClick={logout}>Sign out</button></div></header>{error && <div className="error-banner">{error}<button onClick={() => setError('')}>Dismiss</button></div>}{notice && <div className="notice-banner">{notice}</div>}{loading ? <div className="loading">Loading operational data...</div> : activeView === 'overview' ? <Overview dashboard={dashboard} setActiveView={changeView} /> : activeView === 'alerts' ? <Directory view={activeView} rows={rows} search={search} setSearch={setSearch} onSearch={() => loadView('alerts')} canWrite={canWrite} canReviewAlerts={canReviewAlerts} onCreate={() => setForm(newForm('alert', session.user))} onAction={alertAction} /> : activeView === 'users' || activeView === 'audit' ? <Directory view={activeView} rows={rows} search={search} setSearch={setSearch} onSearch={() => loadView(activeView)} /> : <Directory view={activeView} rows={rows} search={search} setSearch={setSearch} onSearch={() => loadView(activeView)} canWrite={canWrite} onCreate={() => setForm(newForm(activeView === 'cases' ? 'case' : activeView === 'persons' ? 'person' : 'record', session.user))} />}</main>{form && <FormModal form={form} setForm={setForm} submitForm={submitForm} loading={loading} />}</div>
}

function Login({ credentials, setCredentials, onSubmit, onOfflineLogin, loading, error }) {
    return <main className="login-page"><section className="login-art"><p className="eyebrow">DITT · NATIONAL OPERATIONS</p><h1>One record.<br /><em>Everywhere it matters.</em></h1><p>Centralized intelligence for case registration, criminal history verification, and national alert coordination.</p><div className="login-lines"><span>01 / Authenticate</span><span>02 / Investigate</span><span>03 / Authorize</span></div></section><form className="login-form" onSubmit={onSubmit}><div className="brand"><span className="brand-mark">CR</span><span><strong>National</strong><small>Criminal Records</small></span></div><h2>Welcome back</h2><p className="muted">Sign in to the secure operations console.</p><label>Username<input type="text" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} /></label><label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Authenticating...' : 'Access console →'}</button><button type="button" className="outline-button" onClick={onOfflineLogin}>Use offline workspace</button><div className="demo-access"><span>Demo access</span>{demoAccounts.map((account) => <button type="button" key={account.email} onClick={() => setCredentials(account)}>{account.label}</button>)}</div></form></main>
}

function NotificationPanel({ notifications, onClear }) {
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [visibleNotifications, setVisibleNotifications] = useState(notifications)
    function openNotification(notification) {
        const remaining = visibleNotifications.filter((item) => !(item.alert?.id === notification.alert?.id && item.action === notification.action))
        localStorage.setItem('pcrs_notifications', JSON.stringify(remaining))
        setVisibleNotifications(remaining)
        setSelectedNotification(notification)
    }
    return <>
        <div className="notification-panel"><div className="notification-heading"><strong>Live notifications</strong>{visibleNotifications.length > 0 && <button onClick={() => { localStorage.removeItem('pcrs_notifications'); setVisibleNotifications([]); onClear() }}>Clear</button>}</div>{visibleNotifications.length === 0 ? <p className="notification-empty">No new alert activity.</p> : visibleNotifications.map((notification, index) => <button className="notification-item" title={`Wanted alert ${notification.alert.alert_ref || ''}`} key={`${notification.alert.id}-${notification.action}-${index}`} onClick={() => openNotification(notification)}><span className="notification-mark" title="Wanted alert">🚨</span><div><strong>Alert {notification.action}</strong><p>{notification.alert.alert_ref} · {notification.alert.status}</p><small>{new Date(notification.created_at).toLocaleTimeString()}</small></div></button>)}</div>
        {selectedNotification && <AlertNotificationDetails notification={selectedNotification} onClose={() => setSelectedNotification(null)} />}
    </>
}

function AlertNotificationDetails({ notification, onClose }) {
    const person = notification.person
    const name = person ? `${person.first_name || ''} ${person.last_name || ''}`.trim() : 'Person details unavailable'
    return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal panel"><div className="modal-heading"><div><p className="eyebrow">Wanted alert</p><h2>{name}</h2><p>{notification.alert.alert_ref || 'Alert'} · {notification.alert.status || 'pending'}</p></div><button type="button" className="close-button" onClick={onClose}>×</button></div><div className="form-grid"><div><p><strong>Reason for alert</strong></p><p>{notification.alert.reason || 'No reason provided.'}</p><p><strong>Priority</strong></p><p>{notification.alert.priority || '—'}</p></div><div><p><strong>Last known location</strong></p><p>{notification.alert.last_known_loc || '—'}</p><p><strong>Person ID</strong></p><p>{notification.alert.person_id || '—'}</p></div></div>{notification.alert.description && <div><p><strong>Description</strong></p><p>{notification.alert.description}</p></div>}<div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Close</button></div></section></div>
}

function Overview({ dashboard, setActiveView }) {
    const stats = dashboard.stats || {}; const statusRows = dashboard.charts?.casesByStatus || []
    return <div className="content-wrap"><section className="welcome-band"><div><p className="eyebrow">Situation report</p><h2>Good morning, stay ahead of the signal.</h2><p>Live intelligence from the national criminal records network.</p></div><button className="outline-button" onClick={() => setActiveView('alerts')}>Review alerts <span>↗</span></button></section><section className="metric-grid">{[['totalCases', 'Total case files', '▤', 'cases'], ['openCases', 'Active investigations', '◌', 'cases'], ['wantedPersons', 'Wanted persons', '!', 'persons'], ['pendingAlerts', 'Pending authorization', '◷', 'alerts']].map(([key, label, icon, view]) => <button className="metric-card" key={key} onClick={() => setActiveView(view)}><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><strong>{stats[key] ?? '—'}</strong><span className="metric-link">View register →</span></button>)}</section><div className="dashboard-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Case analysis</p><h3>Case status distribution</h3></div><span className="panel-caption">All regions</span></div>{statusRows.length ? statusRows.map((row) => <div className="bar-row" key={row.status}><span>{row.status.replaceAll('_', ' ')}</span><div className="bar-track"><span style={{ width: `${Math.min(100, (Number(row.count) / Math.max(1, stats.totalCases)) * 100)}%` }} /></div><strong>{row.count}</strong></div>) : <p className="empty">No case data available.</p>}</section><section className="panel activity"><div className="panel-heading"><div><p className="eyebrow">Traceability</p><h3>Recent activity</h3></div><span className="panel-caption">Last 10 events</span></div>{(dashboard.recentActivity || []).slice(0, 5).map((activity) => <div className="activity-row" key={activity.id}><span className="activity-dot" /><div><strong>{activity.action.replaceAll('_', ' ')}</strong><p>{activity.user_name || 'System user'} · {new Date(activity.created_at).toLocaleDateString()}</p></div></div>)}</section></div></div>
}

const tableConfig = {
    cases: { title: 'Case register', subtitle: 'Investigations registered across the network', columns: ['reference_no', 'title', 'nature', 'status', 'region'] },
    persons: { title: 'Person register', subtitle: 'Searchable criminal histories and active records', columns: ['id_number', 'first_name', 'last_name', 'alias', 'is_wanted'] },
    records: { title: 'Criminal history register', subtitle: 'Verified and unverified records linked to persons', columns: ['id', 'person_name', 'offence', 'verification_status', 'court'] },
    alerts: { title: 'Alert register', subtitle: 'National wanted alert lifecycle and authorization queue', columns: ['alert_ref', 'person_name', 'priority', 'status', 'last_known_loc'] },
    users: { title: 'User register', subtitle: 'Authorized personnel and access status', columns: ['email', 'first_name', 'last_name', 'role', 'is_active'] },
    audit: { title: 'Audit trail', subtitle: 'Traceable activity across sensitive operations', columns: ['action', 'user_name', 'entity_type', 'details', 'created_at'] },
}

function Directory({ view, rows, search, setSearch, onSearch, canWrite, canReviewAlerts, onCreate, onAction, onOpenPerson }) {
    const [selectedCase, setSelectedCase] = useState(null)
    const config = tableConfig[view]
    const createLabel = view === 'cases' ? 'Register case' : view === 'persons' ? 'Register person' : view === 'records' ? 'Add record' : 'Request alert'
    async function openCase(caseId) {
        const session = JSON.parse(localStorage.getItem('pcrs_session') || 'null')
        if (localStorage.getItem('pcrs_offline_mode') === 'true') {
            const data = JSON.parse(localStorage.getItem('pcrs_offline_data') || '{}')
            const caseItem = (data.cases || []).find((item) => item.id === caseId)
            setSelectedCase(caseItem ? { ...caseItem, persons: (data.persons || []).filter((person) => person.case_id === caseId), alerts: [] } : null)
            return
        }
        const response = await fetch(`/api/cases/${caseId}`, { headers: { Authorization: `Bearer ${session?.token}` } })
        const caseData = await response.json()
        if (!response.ok) return
        caseData.persons = await Promise.all((caseData.persons || []).map(async (person) => {
            const personResponse = await fetch(`/api/persons/${person.id}`, { headers: { Authorization: `Bearer ${session?.token}` } })
            return personResponse.ok ? personResponse.json() : person
        }))
        setSelectedCase(caseData)
    }
    const rowClick = view === 'cases' ? openCase : view === 'persons' && onOpenPerson ? onOpenPerson : null
    return <><div className="content-wrap"><section className="directory-heading"><div><p className="eyebrow">Central register</p><h2>{config.title}</h2><p>{config.subtitle}</p></div><div className="directory-tools"><form className="search-box" onSubmit={(event) => { event.preventDefault(); onSearch() }}><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search register" /></form>{onCreate && <button className="primary-button compact" onClick={onCreate}>+ {createLabel}</button>}</div></section><section className="panel table-panel"><div className="table-wrap"><table><thead><tr>{config.columns.map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}{view === 'alerts' && <th>Actions</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={() => rowClick?.(row.id)} style={rowClick ? { cursor: 'pointer' } : undefined}>{config.columns.map((column) => <td key={column}>{formatCell(column, row[column])}</td>)}{view === 'alerts' && <td className="action-cell">{canReviewAlerts && row.status === 'pending' && <><button className="table-action approve" onClick={() => onAction(row.id, 'authorize')}>Authorize</button><button className="table-action reject" onClick={() => onAction(row.id, 'reject')}>Reject</button></>}{row.status === 'authorized' && <button className="table-action" onClick={() => onAction(row.id, 'issue')}>Issue</button>}{row.status === 'issued' && canWrite && <button className="table-action" onClick={() => onAction(row.id, 'resolve')}>Resolve</button>}</td>}</tr>)}</tbody></table>{!rows.length && <p className="empty">No records found.</p>}</div></section></div>{selectedCase && <CaseProfilePanel caseData={selectedCase} onClose={() => setSelectedCase(null)} />}</>
}

function formatCell(column, value) {
    if (value === null || value === undefined || value === '') return '—'
    if (column === 'is_wanted') return <span className={`pill ${value ? 'danger' : 'verified'}`}>{value ? 'Wanted' : 'Clear'}</span>
    if (column === 'is_active') return <span className={`pill ${value ? 'verified' : 'danger'}`}>{value ? 'Active' : 'Inactive'}</span>
    if (['status', 'priority', 'verification_status', 'role'].includes(column)) return <span className={`pill ${String(value)}`}>{String(value).replaceAll('_', ' ')}</span>
    if (column === 'created_at') return new Date(value).toLocaleString()
    return String(value)
}

function newForm(type, currentUser = null) {
    const values = type === 'case'
        ? { title: '', nature: '', incident_date: '', region: currentUser?.region || '', location: '', description: '' }
        : type === 'person'
            ? { first_name: '', last_name: '', alias: '', date_of_birth: '', gender: 'male', nationality: 'Cameroonian', id_number: '', address: '', physical_desc: '', photo_url: '', photo_file: null }
            : type === 'record'
                ? { person_id: '', offence: '', offence_date: '', offence_location: '', sentence: '', court: '', notes: '' }
                : {
                    identity_status: 'partial_identity',
                    person_id: '',
                    case_id: '',
                    first_name: '',
                    last_name: '',
                    alias: '',
                    gender: 'other',
                    nationality: 'Cameroonian',
                    address: '',
                    physical_desc: '',
                    clothing: '',
                    vehicle: '',
                    witness_description: '',
                    photo_url: '',
                    photo_file: null,
                    reason: '',
                    priority: 'medium',
                    description: '',
                    last_known_loc: '',
                    region: currentUser?.region || '',
                    station: currentUser?.station || ''
                }
    return { type, values }
}

function FormModal({ form, setForm, submitForm, loading }) {
    const labels = {
        case: ['Register case', 'Create a new case file'],
        person: ['Register person', 'Add a person of interest to the central register'],
        record: ['Add criminal record', 'Link an offence history to a person'],
        alert: ['Request wanted alert', 'Unknown suspect / partial identity alert for rapid dispatch']
    }
    const fields = Object.keys(form.values).filter((field) => field !== 'photo_url')
    const photoPreview = form.values.photo_file ? URL.createObjectURL(form.values.photo_file) : form.values.photo_url || ''
    useEffect(() => {
        const lists = form.type === 'alert'
            ? [{ prefix: 'reason', options: alertReasons }, { prefix: 'region', options: regionOptions }]
            : [{ prefix: 'region', options: regionOptions }]
        const replacements = []
        const photoUrlLabel = [...document.querySelectorAll('.modal form label')].find((item) => item.textContent.trim().toLowerCase().startsWith('photo url'))
        if ((form.type === 'alert' || form.type === 'person') && photoUrlLabel) photoUrlLabel.style.display = 'none'
        const personIdLabel = form.type === 'alert' ? [...document.querySelectorAll('.modal form label')].find((item) => item.textContent.trim().toLowerCase().startsWith('person id')) : null
        const personIdInput = personIdLabel?.querySelector('input')
        if (personIdInput) personIdInput.required = false
        let personUpload = null
        if (form.type === 'person') {
            const formElement = document.querySelector('.modal form')
            const firstGrid = formElement?.querySelector('.form-grid')
            if (firstGrid) {
                personUpload = document.createElement('label')
                personUpload.textContent = 'Photo upload'
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.addEventListener('change', (event) => setForm({ ...form, values: { ...form.values, photo_file: event.target.files?.[0] || null } }))
                personUpload.appendChild(input)
                firstGrid.prepend(personUpload)
            }
        }
        lists.forEach(({ prefix, options }) => {
            const label = [...document.querySelectorAll('.modal form label')].find((item) => item.textContent.trim().toLowerCase().startsWith(prefix))
            const input = label?.querySelector('input')
            if (!input) return
            const select = document.createElement('select')
            select.className = input.className
            select.required = input.required
            options.forEach((optionValue) => {
                const option = document.createElement('option')
                option.value = optionValue
                option.textContent = optionValue
                select.appendChild(option)
            })
            select.value = form.values[prefix] || options[0]
            select.addEventListener('change', (event) => setForm({ ...form, values: { ...form.values, [prefix]: event.target.value } }))
            input.replaceWith(select)
            replacements.push({ select, input })
        })
        return () => {
            replacements.forEach(({ select, input }) => select.replaceWith(input))
            if (photoUrlLabel) photoUrlLabel.style.display = ''
            personUpload?.remove()
        }
    }, [form.type])
    return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setForm(null)}><form className="modal panel" onSubmit={submitForm}><div className="modal-heading"><div><p className="eyebrow">Operational action</p><h2>{labels[form.type][0]}</h2><p>{labels[form.type][1]}</p></div><button type="button" className="close-button" onClick={() => setForm(null)}>×</button></div>{form.type === 'alert' && <p className="muted">Partial identity alerts are useful when the suspect is not fully identified yet. Use alias, clothing, vehicle, witness description, location, and station routing to send a rapid notice without waiting for a full file.</p>}{form.type === 'alert' && <div className="form-grid"><label>Photo upload<input type="file" accept="image/*" onChange={(event) => setForm({ ...form, values: { ...form.values, photo_file: event.target.files?.[0] || null } })} /></label>{photoPreview && <div className="photo-preview"><img src={photoPreview} alt="Selected suspect" style={{ maxWidth: '180px', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} /></div>}</div>}<div className="form-grid">{fields.filter((field) => field !== 'photo_file').map((field) => <label key={field}>{field.replaceAll('_', ' ')}{field === 'description' || field === 'physical_desc' || field === 'notes' || field === 'witness_description' ? <textarea required={['case', 'alert'].includes(form.type) && field === 'description'} value={form.values[field]} onChange={(event) => setForm({ ...form, values: { ...form.values, [field]: event.target.value } })} /> : field === 'gender' || field === 'priority' || field === 'identity_status' ? <select value={form.values[field]} onChange={(event) => setForm({ ...form, values: { ...form.values, [field]: event.target.value } })}>{(field === 'gender' ? ['male', 'female', 'other'] : field === 'priority' ? ['low', 'medium', 'high', 'critical'] : ['partial_identity', 'unknown_suspect', 'identified']).map((option) => <option key={option}>{option.replaceAll('_', ' ')}</option>)}</select> : <input required={['title', 'nature', 'incident_date', 'first_name', 'last_name', 'person_id', 'offence', 'reason'].includes(field)} type={field.includes('date') ? 'date' : 'text'} value={form.values[field] || ''} onChange={(event) => setForm({ ...form, values: { ...form.values, [field]: event.target.value } })} />}</label>)}</div><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setForm(null)}>Cancel</button><button className="primary-button" disabled={loading}>{loading ? 'Submitting...' : 'Submit securely'}</button></div></form></div>
}

function CaseProfilePanel({ caseData, onClose }) {
    const [personSearch, setPersonSearch] = useState('')
    const query = personSearch.trim().toLowerCase()
    const persons = (caseData.persons || []).filter((person) => {
        if (!query) return true
        const records = (person.criminal_records || []).map((record) => `${record.offence} ${record.court || ''}`).join(' ')
        return `${person.first_name} ${person.last_name} ${person.alias || ''} ${person.id_number || ''} ${records}`.toLowerCase().includes(query)
    })
    return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal panel" style={{ maxWidth: '860px' }}><div className="modal-heading"><div><p className="eyebrow">Case details</p><h2>{caseData.reference_no || caseData.title}</h2><p>{caseData.title} · {caseData.status || 'open'}</p></div><button type="button" className="close-button" onClick={onClose}>×</button></div><div className="form-grid"><div><p><strong>Nature:</strong> {caseData.nature || '—'}</p><p><strong>Location:</strong> {caseData.location || '—'}</p></div><div><p><strong>Incident date:</strong> {caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : '—'}</p><p><strong>Region:</strong> {caseData.region || '—'}</p></div></div>{caseData.description && <p><strong>Description:</strong> {caseData.description}</p>}<div className="panel-heading"><h3>Persons linked to this case</h3><span>{persons.length} of {(caseData.persons || []).length}</span></div><input className="case-person-search" type="search" value={personSearch} onChange={(event) => setPersonSearch(event.target.value)} placeholder="Search by name, alias, ID, offence, or court" />{persons.length ? persons.map((person) => <div className="panel" key={person.id} style={{ marginTop: '10px', padding: '14px' }}><h4>{person.first_name} {person.last_name} {person.alias ? `(${person.alias})` : ''}</h4><p>{person.role_in_case || 'suspect'} · {person.is_wanted ? 'Wanted' : 'Not currently wanted'}</p>{person.criminal_records?.length ? <div><strong>Criminal records</strong>{person.criminal_records.map((record) => <p key={record.id} style={{ margin: '6px 0' }}>{record.offence} · {record.verification_status || 'unverified'} · {record.court || 'No court recorded'}</p>)}</div> : <p className="empty">No criminal records linked.</p>}</div>) : <p className="empty">No linked person matches this search.</p>}{caseData.alerts?.length ? <><h3 style={{ marginTop: '20px' }}>Related wanted alerts</h3>{caseData.alerts.map((alert) => <p key={alert.id}>{alert.alert_ref} · {alert.status} · {alert.reason}</p>)}</> : null}<div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Close</button></div></section></div>
}

function PersonProfilePanel({ person, onClose }) {
    const name = `${person?.first_name || 'Unknown'} ${person?.last_name || 'Suspect'}`.trim()
    return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal panel" style={{ maxWidth: '720px' }}><div className="modal-heading"><div><p className="eyebrow">Person profile</p><h2>{name}</h2></div><button type="button" className="close-button" onClick={onClose}>×</button></div><div className="form-grid" style={{ gridTemplateColumns: '200px 1fr' }}><div>{person?.photo_url ? <img src={person.photo_url} alt={name} style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }} /> : <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: '#bfc6d9' }}>No photo</div>}</div><div><p><strong>Alias:</strong> {person?.alias || '—'}</p><p><strong>Gender:</strong> {person?.gender || '—'}</p><p><strong>Nationality:</strong> {person?.nationality || '—'}</p><p><strong>ID number:</strong> {person?.id_number || '—'}</p><p><strong>Address:</strong> {person?.address || '—'}</p><p><strong>Physical description:</strong> {person?.physical_desc || '—'}</p><p><strong>Wanted:</strong> {person?.is_wanted ? 'Yes' : 'No'}</p></div></div>{person?.criminal_records?.length ? <div style={{ marginTop: '20px' }}><h3>Criminal records</h3>{person.criminal_records.map((record) => <div key={record.id} className="panel" style={{ padding: '12px', marginTop: '8px' }}><strong>{record.offence}</strong><p>{record.offence_location || 'Unknown location'} · {record.verification_status || 'unverified'}</p></div>)}</div> : <p className="empty">No criminal records linked.</p>}<div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Close</button></div></div></div>
}


export default App
