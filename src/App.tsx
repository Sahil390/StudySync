import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

function Navbar({ onToggleSidebar }){
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={onToggleSidebar}>☰</button>
          <Link to="/" className="text-2xl font-semibold text-sky-600">StudySync</Link>
        </div>
        <nav className="hidden md:flex gap-4 items-center text-sm">
          <Link to="/features" className="hover:text-sky-600">Features</Link>
          <Link to="/resources" className="hover:text-sky-600">Resources</Link>
          <Link to="/dashboard" className="hover:text-sky-600">Dashboard</Link>
          <Link to="/assistant" className="hover:text-sky-600">AI Assistant</Link>
          <Link to="/profile" className="px-3 py-1 border rounded">Profile</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="border-t mt-12 py-6">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600">© {new Date().getFullYear()} StudySync — built for focused learners</div>
    </footer>
  )
}

function Landing(){
  const navigate = useNavigate()
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Study smarter. Sync everything.</h1>
          <p className="mt-4 text-lg text-gray-700">Organize YouTube playlists, annotate PDFs, generate quizzes, and let an AI study assistant help you revise — all in one clean workspace.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="bg-sky-600 text-white px-5 py-2 rounded shadow">Get started</button>
            <a href="#features" className="px-5 py-2 rounded border">See features</a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="p-4 border rounded">PDF summarizer</div>
            <div className="p-4 border rounded">YouTube timestamp notes</div>
            <div className="p-4 border rounded">AI-generated quizzes</div>
            <div className="p-4 border rounded">Study analytics</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-sky-50 to-white border rounded p-6">
          <img alt="mock" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=12b7f2e2b0f4c1b9f4b2c4c3b8b3b3d8" className="rounded shadow" />
        </div>
      </div>

      <section id="features" className="mt-16">
        <h2 className="text-2xl font-semibold">Key features</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <FeatureCard title="YouTube Organizer" desc="Save playlists, add timestamps and notes, and auto-fetch transcripts (via YouTube API)."/>
          <FeatureCard title="PDF Manager" desc="Upload, annotate, and summarize PDFs. Convert notes into flashcards automatically."/>
          <FeatureCard title="AI Assistant" desc="Ask questions about your notes, generate quizzes, and get study plans."/>
        </div>
      </section>

    </main>
  )
}

function FeatureCard({title, desc}){
  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  )
}

function Dashboard(){
  const [studyTime, setStudyTime] = useState(0)
  useEffect(()=>{
    // mock persisted stat
    const s = parseInt(localStorage.getItem('studyTime') || '0', 10)
    setStudyTime(s)
  },[])
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold">Your dashboard</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Study today</p>
          <p className="mt-2 text-3xl font-bold">{studyTime} min</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Active resources</p>
          <p className="mt-2 text-2xl font-semibold">3</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Streak</p>
          <p className="mt-2 text-2xl font-semibold">4 days</p>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="font-semibold">Quick actions</h3>
        <div className="mt-4 flex gap-3">
          <Link to="/resources" className="px-4 py-2 border rounded">Open resources</Link>
          <Link to="/assistant" className="px-4 py-2 bg-sky-600 text-white rounded">Ask AI</Link>
        </div>
      </section>
    </main>
  )
}

function Resources(){
  const [tab, setTab] = useState('youtube')
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold">Resources</h2>
      <div className="mt-4 flex gap-3">
        <button onClick={()=>setTab('youtube')} className={`px-4 py-2 rounded ${tab==='youtube' ? 'bg-sky-600 text-white' : 'border'}`}>YouTube</button>
        <button onClick={()=>setTab('pdfs')} className={`px-4 py-2 rounded ${tab==='pdfs' ? 'bg-sky-600 text-white' : 'border'}`}>PDFs</button>
      </div>
      <div className="mt-6">
        {tab==='youtube' ? <YouTubeOrganizer/> : <PDFManager/>}
      </div>
    </main>
  )
}

function YouTubeOrganizer(){
  const [list, setList] = useState(()=> JSON.parse(localStorage.getItem('ytList') || '[]'))
  const [url, setUrl] = useState('')

  function add(){
    if(!url) return
    const id = Date.now()
    const item = {id, url, title: `YouTube video (${list.length+1})`, notes: ''}
    const n = [...list, item]
    setList(n); localStorage.setItem('ytList', JSON.stringify(n)); setUrl('')
  }

  return (
    <div>
      <h3 className="font-semibold">YouTube Organizer</h3>
      <p className="text-sm text-gray-600 mt-1">Paste links to save and categorize.</p>
      <div className="mt-4 flex gap-2">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/..." className="flex-1 border px-3 py-2 rounded" />
        <button onClick={add} className="px-4 py-2 bg-sky-600 text-white rounded">Add</button>
      </div>

      <div className="mt-6 space-y-3">
        {list.length===0 && <p className="text-gray-500">No videos yet — add one to get started.</p>}
        {list.map(v=> (
          <div key={v.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{v.title}</div>
              <div className="text-sm text-gray-600">{v.url}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">Timestamps</button>
              <button className="px-3 py-1 border rounded">Notes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PDFManager(){
  const [files, setFiles] = useState(()=> JSON.parse(localStorage.getItem('pdfList') || '[]'))
  function onUpload(e){
    const f = e.target.files[0]
    if(!f) return
    const newItem = {id: Date.now(), name: f.name, size: f.size, highlights: []}
    const n = [...files, newItem]
    setFiles(n); localStorage.setItem('pdfList', JSON.stringify(n))
  }
  return (
    <div>
      <h3 className="font-semibold">PDF Manager</h3>
      <p className="text-sm text-gray-600">Upload PDFs, then annotate or summarize them.</p>
      <div className="mt-4">
        <input type="file" accept="application/pdf" onChange={onUpload} />
      </div>
      <div className="mt-6 space-y-3">
        {files.length===0 && <p className="text-gray-500">No PDFs uploaded yet.</p>}
        {files.map(f=> (
          <div key={f.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{f.name}</div>
              <div className="text-sm text-gray-600">{Math.round(f.size/1024)} KB</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">Open</button>
              <button className="px-3 py-1 border rounded">Summarize</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIAssistant(){
  const [messages, setMessages] = useState([{id:1, from:'assistant', text:'Hi! Ask me anything about your notes or videos.'}])
  const [inText, setInText] = useState('')
  function send(){
    if(!inText) return
    const m = {id:Date.now(), from:'user', text:inText}
    setMessages(prev => [...prev, m, {id:Date.now()+1, from:'assistant', text:'(mock reply) — connect to OpenAI API to enable real responses)'}])
    setInText('')
  }
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold">AI Assistant</h2>
      <div className="mt-6 border rounded p-4 bg-white shadow-sm">
        <div className="max-h-80 overflow-y-auto space-y-3">
          {messages.map(m=> (
            <div key={m.id} className={`${m.from==='user' ? 'text-right' : 'text-left'}`}>
              <div className={`${m.from==='user' ? 'inline-block bg-sky-600 text-white' : 'inline-block bg-gray-100 text-gray-800'} p-3 rounded`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={inText} onChange={e=>setInText(e.target.value)} placeholder="Ask about a PDF, video or topic..." className="flex-1 border px-3 py-2 rounded" />
          <button onClick={send} className="px-4 py-2 bg-sky-600 text-white rounded">Send</button>
        </div>
      </div>
    </main>
  )
}

function Profile(){
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-6 p-4 border rounded">
        <p className="text-sm text-gray-600">Name: Anshul (demo)</p>
        <p className="text-sm text-gray-600 mt-2">Email: you@domain.com</p>
        <div className="mt-4">
          <button className="px-3 py-2 border rounded">Edit profile</button>
        </div>
      </div>
    </main>
  )
}

function NotFound(){
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-semibold">Page not found</h2>
      <p className="mt-4 text-gray-600">Go back to <Link to="/" className="text-sky-600">home</Link>.</p>
    </main>
  )
}

export default function App(){
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar onToggleSidebar={()=>setSidebarOpen(v=>!v)} />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/features" element={<Landing/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/resources" element={<Resources/>} />
        <Route path="/assistant" element={<AIAssistant/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Footer/>
    </div>
  )
}