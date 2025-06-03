import ReactDOM from 'react-dom/client'
import './style.css'
import App from './App'
import { ThemeProvider } from "./components/ThemeContext.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<ThemeProvider>
    	<App />
  	</ThemeProvider>
)