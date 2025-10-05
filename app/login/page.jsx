"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    async function submit(e) {
        e.preventDefault()
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
        if (res.ok) {
            // do a full reload so Layout's auth check runs and UI updates
            window.location.href = '/'
        }
        else alert('Invalid')
    }
    return (
        <div className="card small">
            <h2>Login</h2>
            <form onSubmit={submit}>
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="buttons"><button type="submit">Login</button></div>
            </form>
        </div>
    )
}
