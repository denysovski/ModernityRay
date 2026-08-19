import { useEffect, useState } from 'react'
import CartDrawer from './CartDrawer'
import Checkout from './Checkout'

/* Mounted once per page, next to the navbar. Owns which commerce surface is
   open and listens for the `courtsy:open-cart` event that the static subpages
   fire through window.CourtSyCart. */
export default function Commerce() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    const openCart = () => setCartOpen(true)
    window.addEventListener('courtsy:open-cart', openCart)
    return () => window.removeEventListener('courtsy:open-cart', openCart)
  }, [])

  /* The page is deliberately NOT scroll-locked behind these overlays. Locking
     means overflow:hidden, which takes the scrollbar off screen — and the
     scrollbar should stay visible and usable the whole time. Both surfaces are
     fixed-position, so the page moving behind them changes nothing; the panels
     hold their place. Their own scroll areas use overscroll-behavior: contain
     so scrolling inside one never chains out to the page. */

  return (
    <>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
