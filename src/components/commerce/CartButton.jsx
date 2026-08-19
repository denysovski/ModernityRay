import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './useCart'
import { Icon } from '../ui'

/** Black cart button that sits beside the nav's "Become a member" CTA. */
export default function CartButton({ onOpen }) {
  const { count } = useCart()

  return (
    <button className="cart-btn" onClick={onOpen} aria-label={`Cart, ${count} items`}>
      <Icon.cart />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            className="cart-badge"
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
