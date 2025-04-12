import React from 'react'

function TechnicalTile({post}) {
  return (
<div className="min-w-[350px]  gap-8 sm:gap-6 h-auto p-0 sm:pr-4 rounded-3xl border border-gray-300 justify-start items-center flex flex-col sm:flex-row">
        {/* Blog post image */}
        <div className="sm:w-[253px] h-full w-full">
          <img
            loading="lazy"
            src={post.imageUrl}
            alt={`Image for ${post.title}`}
            className="h-full w-full sm:w-fit object-cover sm:rounded-l-lg rounded-3xl"
          />
        </div>

        {/* Blog post content */}
        <div className="flex-col flex-1 justify-start items-start gap-4 inline-flex sm:p-6 py-8 px-4 ">
          {/* Blog post category */}
          <span
            className={`inline-block py-1 text-sm leading-tight bg-[#2C9D27] text-white  rounded  p-2`}
          >
            Technical Session
          </span>

          {/* Blog post title */}
          <h2 className="sm:mt-4 m-0 text-xl font-semibold leading-6 text-neutral-800">
            {post.title}
          </h2>

          {/* Blog post date
          <time className="sm:mt-4 m-0 text-sm leading-snug text-neutral-600">
            {post.date}
          </time> */}

          {/* Read more button */}
          <a href={post.downloadLink} download={post.title}>
            <button className=" px-4 py-1 rounded-full text-sm text-white  font-semibold bg-blue-900 hover:bg-white hover:border hover:border-primary hover:text-primary  ">
              Download
            </button>
          </a>
        </div>
      </div>  )
}

export default TechnicalTile