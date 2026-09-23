import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { makeTranslator } from './i18n'
import { IconCases, IconRecords, IconAlerts, IconAudit } from './icons.jsx'
import logo from './assets/logo.png'
import './App.css'
import './Landing.css'

const featureIcons = [IconCases, IconRecords, IconAlerts, IconAudit]
const featureKeys = [
    ['landingFeatureCasesTitle', 'landingFeatureCasesBody'],
    ['landingFeatureRecordsTitle', 'landingFeatureRecordsBody'],
    ['landingFeatureAlertsTitle', 'landingFeatureAlertsBody'],
    ['landingFeatureAuditTitle', 'landingFeatureAuditBody'],
]
const stepKeys = [
    ['landingStep1Title', 'landingStep1Body'],
    ['landingStep2Title', 'landingStep2Body'],
    ['landingStep3Title', 'landingStep3Body'],
]
const roleKeys = [
    ['landingRoleAdminTitle', 'landingRoleAdminBody'],
    ['landingRolePoliceTitle', 'landingRolePoliceBody'],
    ['landingRoleJudicialTitle', 'landingRoleJudicialBody'],
    ['landingRoleInspectorateTitle', 'landingRoleInspectorateBody'],
]

export default function LandingPage() {
    const [lang, setLang] = useState(() => localStorage.getItem('pcrs_lang') || 'en')
    const t = useMemo(() => makeTranslator(lang), [lang])
    function toggleLang() { const next = lang === 'en' ? 'fr' : 'en'; localStorage.setItem('pcrs_lang', next); setLang(next) }

    return <div className="landing-page">
        <header className="landing-header">
            <div className="brand"><img src={logo} alt="" className="brand-mark" /><span><strong>{t('brandName')}</strong><small>{t('brandSub')}</small></span></div>
            <nav className="landing-nav">
                <a href="#features">{t('landingNav')}</a>
                <a href="#roles">{t('landingNavRoles')}</a>
                <button type="button" className="lang-toggle" onClick={toggleLang} title="Switch language">{lang === 'en' ? 'FR' : 'EN'}</button>
                <Link to="/console" className="outline-button">{t('landingNavSignIn')}</Link>
            </nav>
        </header>

        <section className="landing-hero">
            <p className="eyebrow">{t('landingHeroKicker')}</p>
            <h1>{t('landingHeroHeading1')}<br /><em>{t('landingHeroHeading2')}</em></h1>
            <p className="landing-hero-pitch">{t('landingHeroPitch')}</p>
            <div className="landing-hero-actions">
                <Link to="/console" className="primary-button">{t('landingCtaPrimary')} <span>→</span></Link>
                <a href="#features" className="outline-button">{t('landingCtaSecondary')}</a>
            </div>
            <p className="landing-trust-note">{t('landingTrustNote')}</p>
        </section>

        <section className="landing-features" id="features">
            <p className="eyebrow">{t('landingFeaturesEyebrow')}</p>
            <h2>{t('landingFeaturesHeading')}</h2>
            <div className="landing-feature-grid">
                {featureKeys.map(([titleKey, bodyKey], index) => {
                    const Icon = featureIcons[index]
                    return <div className="landing-feature-card" key={titleKey}>
                        <span className="landing-feature-icon"><Icon /></span>
                        <h3>{t(titleKey)}</h3>
                        <p>{t(bodyKey)}</p>
                    </div>
                })}
            </div>
        </section>

        <section className="landing-steps">
            <p className="eyebrow">{t('landingStepsEyebrow')}</p>
            <h2>{t('landingStepsHeading')}</h2>
            <ol className="landing-steps-list">
                {stepKeys.map(([titleKey, bodyKey], index) => <li key={titleKey}>
                    <span className="landing-step-index">{String(index + 1).padStart(2, '0')}</span>
                    <div><h3>{t(titleKey)}</h3><p>{t(bodyKey)}</p></div>
                </li>)}
            </ol>
        </section>

        <section className="landing-roles" id="roles">
            <p className="eyebrow">{t('landingRolesEyebrow')}</p>
            <h2>{t('landingRolesHeading')}</h2>
            <div className="landing-role-grid">
                {roleKeys.map(([titleKey, bodyKey]) => <div className="landing-role-card" key={titleKey}>
                    <h3>{t(titleKey)}</h3>
                    <p>{t(bodyKey)}</p>
                </div>)}
            </div>
        </section>

        <section className="landing-final">
            <h2>{t('landingFinalHeading')}</h2>
            <p>{t('landingFinalBody')}</p>
            <Link to="/console" className="primary-button">{t('landingCtaPrimary')} <span>→</span></Link>
        </section>

        <footer className="landing-footer">
            <div className="brand"><img src={logo} alt="" className="brand-mark" /><span><strong>{t('brandName')}</strong><small>{t('brandSub')}</small></span></div>
            <p>{t('landingFooterNote')}</p>
        </footer>
    </div>
}
