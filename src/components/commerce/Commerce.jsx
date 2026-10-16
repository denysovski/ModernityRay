import { useNavigate } from 'react-router-dom'
import CartDrawer from './CartDrawer'
import { useStore } from '../../context/StoreContext'
import { paths } from '../../routes'

/* Mounted once in RootLayout, beside the navbar.
 *
 * The drawer's open state used to live here and was opened by a window event,
 * because the generated static subpages had no way into React. Both are gone:
 * the whole site is one React tree now, so the state lives in the store
 * context and any view can call openCart() directly.
 *
 * Checkout is no longer a modal — it is the /checkout route — so "Checkout"
 * closes the drawer and navigates.
 */
export default function Commerce() {
  const { cartOpen, closeCart } = useStore()
  const navigate = useNavigate()

  /* The page is deliberately NOT scroll-locked behind the drawer. Locking
     means overflow:hidden, which takes the scrollbar off screen — and the
     scrollbar should stay visible and usable the whole time. The panel is
     fixed-position, so the page moving behind it changes nothing; its own
     scroll area uses overscroll-behavior: contain so scrolling inside never
     chains out to the page. */

  return (
    <CartDrawer
      open={cartOpen}
      onClose={closeCart}
      onCheckout={() => {
        closeCart()
        navigate(paths.checkout)
      }}
    />
  )
}
