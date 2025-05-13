"use client";

import React, { useState, useEffect } from "react";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

function TestingPage() {
  const [value, setValue] = useState(`<article>
  <h1>Your Blog Title</h1>
  
  <p>Welcome to your <em><span style="background-color: var(--tt-color-highlight-yellow)">new blog post</span></em>! This is your introduction paragraph where you can <strong>highlight</strong> key points and set the tone for your readers.</p>

  <h2>Key Points</h2>

  <blockquote>
    <p><em>Start with a compelling quote or important message that captures the essence of your post. This helps engage readers from the start.</em></p>
  </blockquote>

  <p>Add your main content here. You can include <span style="background-color: var(--tt-color-highlight-blue)">important highlights</span> and format your text to make it more engaging.</p>

  <img src="/Logo_big.png" alt="Your image description" title="Your image title">

  <ul>
    <li><strong>First Point</strong>: Add your first key point here.</li>
    <li><strong>Second Point</strong>: Add your second key point here.</li>
  </ul>

  <hr>

  <h2>Next Steps</h2>

  <p>Conclude your post with a call to action or next steps for your readers.</p>

  <ul class="task-list">
    <li class="task-item">
      <input type="checkbox" disabled>
      <span>Add your first action item</span>
    </li>
    <li class="task-item">
      <input type="checkbox" disabled>
      <span>Add your second action item</span>
    </li>
  </ul>
</article>`);

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="mt-20">
      TestingPage
      <div
        className="m-10 w-full
        "
      >
        <SimpleEditor onUpdate={setValue} value={value} />
      </div>
    </div>
  );
}

export default TestingPage;
