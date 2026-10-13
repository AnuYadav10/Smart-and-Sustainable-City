import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    problemType: 'Road Damage',
    description: '',
    date: ''
  })

  const [message, setMessage] = useState('')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadReports() {
    try {
      const response = await fetch('/api/reports')
      const result = await response.json()

      if (response.ok && result.success) {
        setReports(result.data)
      }
    } catch (error) {
      console.log('Unable to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('Your problem report was submitted successfully!')
        setForm({
          name: '',
          email: '',
          location: '',
          problemType: 'Road Damage',
          description: '',
          date: ''
        })
        await loadReports()
      } else {
        setMessage(result.message || 'Unable to submit the report.')
      }
    } catch (error) {
      setMessage('Could not connect to the server. Please try again.')
    }
  }

  return (
    <>
      <header className="city-header">
        <h1>Smart &amp; Sustainable City</h1>
        <p>Citizen Problem Reporting Portal</p>
      </header>

      <nav className="city-nav">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">City Services</a>
        <a href="#report">Report a Problem</a>
        <a href="#reports">View Reports</a>
        <a href="#contact">Contact</a>
      </nav>

      <main>
        <section id="home" className="welcome">
          <h2>Welcome to Smart City</h2>
          <p>
            Working together to make our city cleaner, safer
            and more sustainable.
          </p>
          <a className="city-button" href="#report">
            Report a Problem
          </a>
        </section>

        <section id="about">
          <h2>About Our Project</h2>
          <p>
            This portal helps citizens report local problems
            such as road damage, water issues, street lights
            and cleanliness.
          </p>
        </section>

        <section id="services">
          <h2>City Services</h2>
          <div className="city-cards">
            <article>Road Problems</article>
            <article>Water Problems</article>
            <article>Street Lights</article>
            <article>Cleanliness</article>
          </div>
        </section>

        <section id="report">
          <h2>Report a City Problem</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <label>Problem Type</label>
            <select
              name="problemType"
              value={form.problemType}
              onChange={handleChange}
              required
            >
              <option>Road Damage</option>
              <option>Water Problem</option>
              <option>Street Light</option>
              <option>Cleanliness</option>
              <option>Other</option>
            </select>

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <button className="city-button" type="submit">
              Submit Report
            </button>
          </form>

          {message && <p role="status">{message}</p>}
        </section>

        <section id="reports">
          <h2>Submitted Reports</h2>
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p>No reports submitted yet.</p>
          ) : (
            <div className="city-cards">
              {reports.map((report) => (
                <article key={report.id}>
                  <h3>{report.problemType}</h3>
                  <p><strong>Name:</strong> {report.name}</p>
                  <p><strong>Location:</strong> {report.location}</p>
                  <p><strong>Description:</strong> {report.description}</p>
                  <p><strong>Date:</strong> {report.date}</p>
                </article>
              ))}
            </div>
          )}

          <button
            className="city-button"
            type="button"
            onClick={loadReports}
          >
            Refresh Reports
          </button>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>Have a question? Contact us through our existing contact form.</p>
          <a className="city-button" href="/contact.html">
            Contact Us
          </a>
        </section>
      </main>

      <footer className="city-footer">
        <p>
          Smart &amp; Sustainable City | Citizen Problem Reporting Portal
        </p>
      </footer>
    </>
  )
}

export default App
