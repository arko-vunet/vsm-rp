import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme } from '@grafana/data'
import { ThemeContext } from '@grafana/ui'
import './index.css'
import App from './App.jsx'

function Root() {
  const [themeMode, setThemeMode] = useState('light')
  const grafanaTheme = useMemo(
    () =>
      createTheme({
        colors: { mode: themeMode },
        typography: {
          fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          fontFamilyMonospace:
            '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      }),
    [themeMode],
  )

  const handleToggleTheme = () => {
    setThemeMode((mode) => (mode === 'light' ? 'dark' : 'light'))
  }

  return (
    <StrictMode>
      <ThemeContext.Provider value={grafanaTheme}>
        <App onToggleTheme={handleToggleTheme} />
      </ThemeContext.Provider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(
  <Root />,
)
