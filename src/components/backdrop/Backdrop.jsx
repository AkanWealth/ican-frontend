import React from 'react'
import { motion } from 'framer-motion'

function Backdrop({children, onClick}) {
  return (

    <motion.div
    className=' absolute top-0 left-0 h-full w-full'
    onClick={onclick}
    >


    {children}
    </motion.div>
  )
}

export default Backdrop