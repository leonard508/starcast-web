import Link from 'next/link'

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Test Page</h1>
      <p>If you can see this, the Next.js server is working correctly.</p>
      <hr />
      <h2>Server Information:</h2>
      <ul>
        <li>✅ Next.js server is running</li>
        <li>✅ React components are rendering</li>
        <li>✅ Pages are accessible</li>
      </ul>
      <hr />
      <h2>Quick Navigation:</h2>
      <ul>
        <li><Link href="/login">🔐 Login Page</Link></li>
        <li><Link href="/admin">👨‍💼 Admin Dashboard</Link></li>
        <li><Link href="/">🏠 Home Page</Link></li>
      </ul>
      <hr />
      <p><strong>Next Step:</strong> Try accessing the admin dashboard</p>
    </div>
  )
}