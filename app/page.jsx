"use client"
import PasswordGenerator from '../components/PasswordGenerator'
import IconSpark from '../components/IconSpark'
import { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'

function Feature({ title, desc }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )
}

export default function Page() {
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ users: 0, vaults: 0 })
    const [last, setLast] = useState('')
    const [passphrase, setPassphrase] = useState('')
    const [title, setTitle] = useState('My entry')
    const [msg, setMsg] = useState('')

    useEffect(() => { (async () => { const r = await fetch('/api/auth/me'); setUser((await r.json()).user) })(); }, [])
    useEffect(() => { (async () => { try { const r = await fetch('/api/stats'); setStats(await r.json()) } catch (e) { } })(); }, [])

    async function save(pwd) {
        if (!passphrase) return setMsg('Set a local passphrase to encrypt')
        const blob = CryptoJS.AES.encrypt(pwd, passphrase).toString()
        const res = await fetch('/api/vault', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, blob }) })
        if (res.ok) setMsg('Saved')
        else setMsg('Save failed')
    }

    return (
        <div>
            {!user ? (
                <div className="hero-guest">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18 }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <IconSpark size={56} />
                        </div>
                        <div className="brand-pill">PassVault</div>
                        <h2>Manage passwords with ease — private, fast, and secure</h2>
                        <p style={{ maxWidth: 820 }}>Stay organized, boost productivity, and keep your passwords safe. All encryption happens in your browser and only ciphertext is stored.</p>
                        <div className="hero-ctas">
                            <a className="btn gradient" href="/signup">Get Started Free</a>
                            <a className="btn ghost-dark" href="/login">Learn More</a>
                        </div>
                        <div style={{ width: '100%', marginTop: 28 }}>
                            <div className="features">
                                <div className="feat-card">
                                    <div className="feat-icon">✨</div>
                                    <h4>Smart Organization</h4>
                                    <p className="muted">Organize tasks (passwords) with intuitive categories and priorities.</p>
                                </div>
                                <div className="feat-card">
                                    <div className="feat-icon">🔄</div>
                                    <h4>Client-side Encryption</h4>
                                    <p className="muted">AES encrypt in your browser — server stores only ciphertext.</p>
                                </div>
                                <div className="feat-card">
                                    <div className="feat-icon">📱</div>
                                    <h4>Responsive Design</h4>
                                    <p className="muted">Access your vault from any device, anywhere.</p>
                                </div>
                            </div>
                            <div className="stats-row">
                                <div className="stat-pill"><h3>{stats.users}k+</h3><div className="muted">users</div></div>
                                <div className="stat-pill"><h3>{stats.vaults}</h3><div className="muted">vault items</div></div>
                                <div className="stat-pill"><h3>99%</h3><div className="muted">uptime</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="card cta">
                        <div>
                            <h2>PassVault — Generate & store passwords securely</h2>
                            <p>Generate strong passwords, encrypt them in your browser, and store only ciphertext on the server. You keep the passphrase.</p>
                            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                <a className="btn" href="/vault">Open your vault</a>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.users}</div>
                            <div className="muted">users • {stats.vaults} items</div>
                        </div>
                    </div>

                    <h3 style={{ marginTop: 20 }}>Key features</h3>
                    <div className="grid">
                        <div>
                            <Feature title="Strong generator" desc="Slider, include/exclude characters, instant results" />
                            <Feature title="Client-side encryption" desc="AES encrypt in your browser — server stores only ciphertext" />
                            <Feature title="Simple auth" desc="Email/password sign up and login with httpOnly cookie" />
                        </div>
                        <div>
                            <PasswordGenerator onGenerated={p => setLast(p)} />
                            <div className="card" style={{ marginTop: 12 }}>
                                <h3>Save to Vault</h3>
                                <label>Passphrase (kept in memory)</label>
                                <input value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder="local secret" />
                                <label>Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} />
                                <label>Preview</label>
                                <input readOnly value={last} />
                                <div className="buttons"><button onClick={() => save(last)}>Save</button></div>
                                {msg && <div className="msg">{msg}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
