import './app.scss'
import '../node_modules/normalize.css/normalize.css'
import App from './App.svelte'

console.log("[INFO/STAT] Version: 0.0.1.20241911")
console.log("[INFO/STAT] Made with love by Joey :)")

const app = new App({
  target: document.getElementById('app'),
})

console.log("[INFO/STAT] Injected main layout")

export default app
