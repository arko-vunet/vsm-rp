import { useEffect, useMemo, useState } from 'react'
import { useTheme2 } from '@grafana/ui'
import { marked } from 'marked'
import UtilityHeader from './components/utility/UtilityHeader.jsx'
import './App.css'

function App({ onToggleTheme }) {
  const isChangelog = window.location.pathname === '/changelog'
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme2()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--app-text', theme.colors.text.primary)
  }, [theme])

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
    <main
      className={`w-full ${isChangelog ? 'changelog-page' : ''}`}
      style={{
        backgroundColor: theme.colors.background.primary,
        color: 'var(--app-text)',
        minHeight: '100vh',
      }}
    >
      <UtilityHeader onToggleTheme={onToggleTheme} />
      <div className="mx-auto w-full max-w-[640px] pt-24">
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
          <div className="text-5xl font-bold">
            vuSmartMaps <br /> Rapid Prototyping
          </div>
        )}
      </div>
    </main>
  )
}

export default App
