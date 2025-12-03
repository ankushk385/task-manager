import React, { useState } from 'react';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const api = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(api + '/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) onRegister(data.token);
    else alert(data.message || JSON.stringify(data));
  };

  return (
    <form onSubmit={submit}>
      <div><input placeholder='name' value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type='submit'>Register</button>
    </form>
  );
}
