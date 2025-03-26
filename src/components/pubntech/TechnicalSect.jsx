"use client"

import React from 'react'
import TechnicalTile from './TechnicalTile'
import { technicalPosts } from "@/lib/technicaldata";

function TechnicalSect() {
    var raw = technicalPosts.slice(0, 4);

  return (
    <div className=" p-4  sm:p-20 lg:px-40 w-full flex flex-col gap-12 justify-start items-start ">
    <h3 className="text-primary text-3xl sm:text-4xl font-bold font-mono ">
Technical Sessions    </h3>
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      aria-label="Downloadable Contents"
    >
       {raw.map((post) => (
          <TechnicalTile
            key={post.id}
            post={post}
          />
        ))}
    </section>
  </div>  )
}

export default TechnicalSect