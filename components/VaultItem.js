"use client";
import CryptoJS from "crypto-js";
import { useState } from "react";

export default function VaultItem({ item, passphrase, onDelete, onSave }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [decrypted, setDecrypted] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  function decrypt() {
    if (!passphrase || passphrase.trim() === "") {
      setDecrypted("Enter a passphrase above to decrypt");
      setEditText("");
      setEditing(false);
      setOpen(true);
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(item.blob, passphrase.trim());
      const txt = bytes.toString(CryptoJS.enc.Utf8);
      if (!txt) {
        setDecrypted("Unable to decrypt — check your passphrase");
        setEditText("");
        setEditing(false);
      } else {
        setDecrypted(txt);
        setEditText(txt);
        setEditing(true);
      }
      setOpen(true);
    } catch (e) {
      setDecrypted("Unable to decrypt (error)");
      setEditText("");
      setEditing(false);
      setOpen(true);
    }
  }

  async function save() {
    if (!passphrase || passphrase.trim() === "") {
      alert("Enter passphrase to save");
      return;
    }
    // If user edited the plaintext, re-encrypt it with the provided passphrase
    const plaintext = editing ? editText : decrypted;
    const newBlob = CryptoJS.AES.encrypt(
      plaintext || "",
      passphrase.trim()
    ).toString();
    await fetch(`/api/vault/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, blob: newBlob }),
    });
    if (onSave) onSave();
    setDecrypted(plaintext);
    setEditing(false);
  }

  return (
    <div className="vault-item card">
      <div className="row between">
        <strong>{item.title}</strong>
        <div>
          <button onClick={decrypt}>Open</button>
          <button
            onClick={() => {
              if (confirm("Delete?")) {
                onDelete(item._id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {open && (
        <div className="blob">
          <label>Decrypted:</label>
          <textarea
            rows={6}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="buttons">
            <button onClick={save}>Save</button>
            <button
              onClick={() => {
                setOpen(false);
                setEditing(false);
              }}
            >
              Close
            </button>
          </div>
          {!editing && <div className="muted">{decrypted}</div>}
        </div>
      )}
    </div>
  );
}
