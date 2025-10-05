"use client"
import { useEffect, useState } from 'react'
import VaultItem from '../../components/VaultItem'

export default function VaultPage() {
    const [items, setItems] = useState([])
    const [passphrase, setPassphrase] = useState('')
    const [q, setQ] = useState('')

    async function load() {
        const res = await fetch('/api/vault')
        if (res.ok) setItems(await res.json())
        else setItems([])
    }

    useEffect(() => { load() }, [])

    async function del(id) { await fetch(`/api/vault/${id}`, { method: 'DELETE' }); load() }

    const filtered = items.filter(it => it.title.toLowerCase().includes(q.toLowerCase()))

    return (
        <div className="card">
            <h2>Your Vault</h2>
            <label>Passphrase (used to decrypt client-side)</label>
            <input value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder="local secret" />
            <label>Search</label>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="filter by title" />
            <div className="list">
                {filtered.map(it => (
                    <VaultItem key={it._id} item={it} passphrase={passphrase} onDelete={del} onSave={load} />
                ))}
                {filtered.length === 0 && <div className="muted">No items</div>}
            </div>
        </div>
    )
}
