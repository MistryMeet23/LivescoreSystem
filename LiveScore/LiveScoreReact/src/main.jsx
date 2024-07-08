import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { stores } from './Redux/store.js'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './Components/Custom/Custom.js'
import './index.css'
// import { theme } from '/Custom/Custom.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <Provider store={stores}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
