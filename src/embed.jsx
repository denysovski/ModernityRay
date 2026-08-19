/* Self-contained bundle that mounts the real React navbar (and social dock)
   onto the static .html subpages, so they share the exact same component,
   animations and mega-menus as the homepage.
   Built by `npm run build:embed` into public/embed. */
import './styles/index.css'
import './styles/app.css'
import { createRoot } from 'react-dom/client'
import Navbar from './components/layout/Navbar'
import SocialDock from './components/layout/SocialDock'
import Commerce from './components/commerce/Commerce'

const navEl = document.getElementById('cs-nav')
if (navEl) {
  // the cart drawer and checkout ride along with the navbar, so every static
  // subpage gets the same commerce layer as the homepage
  createRoot(navEl).render(
    <>
      <Navbar />
      <Commerce />
    </>,
  )
}

const dockEl = document.getElementById('cs-dock')
if (dockEl) createRoot(dockEl).render(<SocialDock />)
