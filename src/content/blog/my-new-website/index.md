---
date: "2022-03-15"
tags: ["blog", "portfolio", "skills"]
extraTags: ["webpack-loader", "jsx"]
---

# My new website

If you read this quickly after publication, the chance is high you are on my
newly build website. There are multiple techniques used on this website to
archive my goals. Doing this mix with a static website vs easy to add content
was quite the technical challenge, but looking at this website shows I succeeded
in my goals.

## Goals

* Static HTML pages
* Minimal javascript
* Automatic compiling of markdown posts
* Dark/white theme support based on the browser, with user override
* Quick load times
* Contribution graph like github

## Skills learned

* [Writing my own webpack loader](https://www.npmjs.com/package/json-tagged-file-loader)
* Using JSX without depending on React

## Blog post supporting markdown

This blog post support *italic* and **bold** text, because of the markdown
engine on the background.

We can also embed image into the markdown files, as shown below:

![An photo of a standard television test screen](test.jpg "An HD television test screen")

Code blocks are highlighted: (And it works with dark/light mode without any
javascript that is reran)

```typescript
export default function assertNever(input: never): never {
    throw new Error('Expected never, got: ' + JSON.stringify(input));
}

```
