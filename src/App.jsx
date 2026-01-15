import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import './App.css'

function App() {
  const isChangelog = window.location.pathname === '/changelog'
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isChangelog) {
      return
    }

    let isMounted = true
    fetch('/changelog.md')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load changelog.')
        }
        return response.text()
      })
      .then((text) => {
        if (isMounted) {
          setMarkdown(text)
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Changelog is unavailable right now.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [isChangelog])

  const changelogHtml = useMemo(() => marked.parse(markdown), [markdown])

  return (
    <main className={isChangelog ? 'changelog-page' : undefined}>
      {isChangelog ? (
        <>
          {error ? (
            <p>{error}</p>
          ) : markdown ? (
            <div
              className="changelog"
              dangerouslySetInnerHTML={{ __html: changelogHtml }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </>
      ) : (
        <h1>
          vuSmartMaps <br /> Rapid Prototyping
        </h1>
      )}
    </main>
  )
}

export default App
