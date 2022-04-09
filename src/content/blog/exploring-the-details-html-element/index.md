---
date: "2022-04-09"
tags: ["blog", "exploring", "html", "under-used"]
extraTags: []
---

# Exploring the details html element

One of the underused HTML elements is the `<details>` element. For the uses
cases this tag gives you, it is not used enough on websites.

Lets explore its uses together. This tag is used to make an expanding/collapsing
detail/summary view. The browser then adds interaction to the element, allowing
the user to open/close the element itself. Lets take a look at a basic example:

```html
<details>
    <summary>This is the summary</summary>
    <p>This is the body</p>
    <p>Multiple tags are allowed here</p>
</details>
```

<code-preview>
</code-preview>

This tag only has 1 defined attribute:

* `open`: If this is set on the details element, it will default to the
  initial open position.

One other advantage of the details element, is that it comes with its own
accessibility support by being a default browser element. This is very
useful, as you do not have to play around with all those aria tags that you
normally find on JavaScript based accordion implementations.

While a single details looks very simple, it becomes more useful when you nest
multiple in each other. This can be done without issues as they can be nested
just like any HTML tags. We can then style it with the minium of CSS, just to
make it look a bit better.

```css
ul {
    list-style: none
}
```

```html
<details open>
    <summary><samp>C:</samp> 100GB</summary>
    <ul>
        <li><details>
            <summary><samp>Windows</samp> 20GB</summary> 
            <ul>
                <li><details>
                    <summary><samp>System32</samp> 10GB</summary>
                    <ul>
                        <li><em>More files...</em></li>
                        <li><em>More files...</em></li>
                        <li><em>More files...</em></li>
                    </ul>
                </details></li>
                <li><details>
                    <summary><samp>Not System32</samp>: 10GB</summary>
                    <ul>
                        <li><em>More files...</em></li>
                        <li><em>More files...</em></li>
                        <li><em>More files...</em></li>
                    </ul>
                </details></li>
                <li><em>More files...</em></li>
                <li><em>More files...</em></li>
            </ul>
        </details></li>
        <li><em>More files...</em></li>
        <li><em>More files...</em></li>
    </ul>
</details>
```

<code-preview>
</code-preview>
