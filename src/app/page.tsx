"use client"

import React from 'react'
import Link from 'next/link'
import {useAuth} from "../AuthContext"

function page() {
  const {logout} = useAuth();

  return (
   <div>
      homepage 
   </div>
  )
}




export default page