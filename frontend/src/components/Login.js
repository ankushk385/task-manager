import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const api = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(api + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) onLogin(data.token);
    else alert(data.message || JSON.stringify(data));
  };

  return (
    <form onSubmit={submit}>
      <div>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div>
        <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
}
