import { motion, AnimatePresence } from 'framer-motion'

interface StreamingTextProps {
  text: string
  isDone: boolean
  className?: string
}

export function StreamingText({ text, isDone, className }: StreamingTextProps) {
  return (
    <p className={className}>
      {text}
      <AnimatePresence>
        {!isDone && (
          <motion.span
            key="cursor"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 align-middle"
          />
        )}
      </AnimatePresence>
    </p>
  )
}
