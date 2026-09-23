const base = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
}

// Dashboard grid — Overview
export function IconOverview() {
    return <svg {...base}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </svg>
}

// Briefcase — Case register
export function IconCases() {
    return <svg {...base}>
        <rect x="2.5" y="7" width="19" height="13" rx="2.2" />
        <path d="M8 7V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7" />
        <path d="M2.5 13h19" />
        <path d="M10.7 13v1.4a1.3 1.3 0 0 0 1.3 1.3v0a1.3 1.3 0 0 0 1.3-1.3V13" />
    </svg>
}

// Person + magnifier — Persons of interest
export function IconPersons() {
    return <svg {...base}>
        <circle cx="9.5" cy="7.2" r="3.7" />
        <path d="M2.7 20.5v-1.3a5.8 5.8 0 0 1 5.8-5.8h1.6" />
        <circle cx="16.6" cy="16.6" r="3.4" />
        <path d="M19.4 19.4 21.5 21.5" />
    </svg>
}

// Fingerprint — Criminal records
export function IconRecords() {
    return <svg {...base}>
        <path d="M12 4.5a7.5 7.5 0 0 1 7.5 7.5c0 1.6-.2 2.9-.6 4" />
        <path d="M12 4.5a7.5 7.5 0 0 0-7.5 7.5c0 1 .05 1.9.2 2.7" />
        <path d="M8.2 20.2c-.7-1.4-1.2-3.1-1.2-5.2a5 5 0 0 1 10 0c0 .5-.02.95-.06 1.4" />
        <path d="M12 10.5a3.5 3.5 0 0 1 3.5 3.5c0 2.6-.6 4.6-1.4 6.2" />
        <path d="M12 10.5A3.5 3.5 0 0 0 8.5 14c0 .8.06 1.5.16 2.1" />
        <path d="M12 14v.6" />
    </svg>
}

// Siren triangle — Wanted alerts
export function IconAlerts() {
    return <svg {...base}>
        <path d="M12 3.2 2.4 20h19.2L12 3.2Z" />
        <path d="M12 9.5v4.3" />
        <path d="M12 17.1h.01" />
    </svg>
}

// Two people — Users (governance)
export function IconUsers() {
    return <svg {...base}>
        <circle cx="9" cy="7.5" r="3.4" />
        <path d="M2.8 20.2v-1.1a5 5 0 0 1 5-5h2.4a5 5 0 0 1 5 5v1.1" />
        <path d="M16.2 4.3a3.4 3.4 0 0 1 0 6.4" />
        <path d="M20.3 20.2v-1.1a5 5 0 0 0-3.2-4.66" />
    </svg>
}

// Clock history — Audit trail
export function IconAudit() {
    return <svg {...base}>
        <path d="M3.5 12a8.5 8.5 0 1 0 2.9-6.4" />
        <path d="M3 4v4.4h4.4" />
        <path d="M12 8v4.3l3 1.8" />
    </svg>
}

// Open folder — Open cases
export function IconFolderOpen() {
    return <svg {...base}>
        <path d="M3 7.5a1.8 1.8 0 0 1 1.8-1.8h3.6l1.8 2.3h8a1.8 1.8 0 0 1 1.8 1.8v.7H5.6a1.8 1.8 0 0 0-1.76 1.43L2.3 18.6" />
        <path d="M4.6 19.5h14.2a1.8 1.8 0 0 0 1.76-1.43l1.14-5.7a1.4 1.4 0 0 0-1.37-1.67H5.6a1.8 1.8 0 0 0-1.76 1.43L2.7 18.03A1.4 1.4 0 0 0 4.07 19.5Z" />
    </svg>
}

// Target crosshair — Wanted persons
export function IconTarget() {
    return <svg {...base}>
        <circle cx="12" cy="12" r="8.3" />
        <circle cx="12" cy="12" r="4.6" />
        <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" />
    </svg>
}

// Clock face — Pending
export function IconClock() {
    return <svg {...base}>
        <circle cx="12" cy="12" r="8.3" />
        <path d="M12 7.3V12l3.2 1.9" />
    </svg>
}

// Single person — Persons total
export function IconPerson() {
    return <svg {...base}>
        <circle cx="12" cy="7.6" r="4" />
        <path d="M4.3 20.5v-1.2a5.6 5.6 0 0 1 5.6-5.6h4.2a5.6 5.6 0 0 1 5.6 5.6v1.2" />
    </svg>
}

// Padlock — Password field
export function IconLock() {
    return <svg {...base}>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
        <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" />
        <path d="M12 14.5v3" />
    </svg>
}

// Eye — Show password
export function IconEye() {
    return <svg {...base}>
        <path d="M2.2 12S5.6 5.3 12 5.3 21.8 12 21.8 12 18.4 18.7 12 18.7 2.2 12 2.2 12Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
}

// Eye with slash — Hide password
export function IconEyeOff() {
    return <svg {...base}>
        <path d="M3.5 3.5l17 17" />
        <path d="M10.6 5.5c.45-.08.92-.13 1.4-.13 6.4 0 9.8 6.7 9.8 6.7a15.6 15.6 0 0 1-3.4 4.4" />
        <path d="M6.6 6.7A15.8 15.8 0 0 0 2.2 12s3.4 6.7 9.8 6.7c1.4 0 2.66-.32 3.76-.83" />
        <path d="M9.7 9.9a3 3 0 0 0 4.1 4.2" />
    </svg>
}
