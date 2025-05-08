import { useEffect } from 'react'
import Markdown from 'react-markdown'
import type { Heading, Root } from 'mdast'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const remarkCollapseH2: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const styleNode = {
      type: 'html' as const,
      value: `
        <style>
          details summary {
            list-style: none;
            cursor: pointer;
            display: inline-flex;
            justify-content: center;
            align-items: center;
          }
          
          details summary::-webkit-details-marker {
            display: none;
          }
          
          details .custom-arrow {
            transition: transform 0.3s ease;
            display: inline-flex;
            fill: var(--color-primary-blue);
            margin-bottom:1em;
            margin-left: 0.5em;
          }

                  details .copy {
            display: none;
          }
          details[open] .copy {
            display: inline-flex;
            fill: var(--color-primary-blue);
            margin-bottom:1em;
            margin-left: 0.5em;
            cursor: pointer;
          }

          details .copy.copied {
            fill: var(--color-green-success); /* or another "success" color */
            animation: pulse 0.4s ease;
          }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(0.9);
            }
            100% {
                transform: scale(1);
            }
        }
          
          details[open] .custom-arrow {
            transform: rotate(180deg);
          }

          .tooltip-wrapper {
            position: relative;
            display: inline-block;
            }

        .tooltip-text {
            visibility: hidden;
            text-align: center;
            position: absolute;
            z-index: 1;
            bottom: 110%;
            transform: translateX(-50%);
            white-space: nowrap;
            opacity: 0;
            font: var(--font-M);
            border-radius: var(--border-radius);
            background: var(--color-primary-blue);
            color: var(--color-white);
            padding: var(--space-XS) var(--space-S);
            transition: var(--transition);
            border: var(--border-white);
            width: max-content;
            max-width: 30rem;
        }

            .tooltip-wrapper:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
            }
        </style>
      `,
    }
    tree.children.unshift(styleNode)

    let processedUpTo = 0

    visit(tree, 'heading', (node, index, parent) => {
      if (
        !parent ||
        index === undefined ||
        node.type !== 'heading' ||
        node.depth !== 2 ||
        index < processedUpTo
      ) {
        return
      }
      const title = node.children.map((child) => ('value' in child ? child.value : '')).join('')

      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      parent.children.splice(index, 1, {
        type: 'html',
        value: `<details id="${id}">
          <summary>
                <h2>${title}</h2> 
                <svg class="custom-arrow" width="20" height="20" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M14.54 7.54a.65.65 0 01.988.84l-.068.08-5 5a.65.65 0 01-.84.068l-.08-.068-5-5a.65.65 0 01.84-.988l.08.068L10 12.081l4.54-4.54z" fill-rule="nonzero"/></svg>
                <span class="tooltip-wrapper">
                <svg class="copy" width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5c.78 0 1.42.6 1.5 1.36V18c0 .78-.6 1.42-1.36 1.5H4a1.5 1.5 0 01-1.5-1.36V6c0-.78.6-1.42 1.36-1.5H12zM12 6H4v12h8V6zm4-4.75c.38 0 .7.28.74.65l.01.1v12c0 .38-.28.7-.65.74l-.1.01h-1.5v-1.5h.75V2.75h-6.5v.75h-1.5V2c0-.38.28-.7.65-.74l.1-.01h8z"/></svg>
                <span class="tooltip-text">Copy URL for this section</span>
                </span>
            </summary> `,
      })

      let nextH2Index = index + 1
      while (
        nextH2Index < parent.children.length &&
        !(
          parent.children[nextH2Index].type === 'heading' &&
          'depth' in parent.children[nextH2Index] &&
          (parent.children[nextH2Index] as Heading).depth === 2
        )
      ) {
        nextH2Index++
      }

      parent.children.splice(nextH2Index, 0, {
        type: 'html',
        value: `</details>`,
      })

      processedUpTo = nextH2Index + 1

      return nextH2Index
    })
  }
}

function EnhancedMarkdown({ content }: { content: string }) {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const el = document.getElementById(hash)
      if (el && el.tagName.toLowerCase() === 'details') {
        el.setAttribute('open', 'true')
        el.scrollIntoView()
      }
    }

    const summaries = document.querySelectorAll('details > summary')
    const copyButtons = document.querySelectorAll('.copy')

    const summaryHandlers: (() => void)[] = []
    const copyHandlers: (() => void)[] = []

    summaries.forEach((summary) => {
      const handler = (e: Event) => {
        const target = e.target as HTMLElement
        if (target.closest('h2') || target.closest('.custom-arrow')) {
          const details = summary.parentElement as HTMLDetailsElement
          details.open = !details.open
        }
        e.preventDefault()
      }
      summary.addEventListener('click', handler)
      summaryHandlers.push(() => summary.removeEventListener('click', handler))
    })

    copyButtons.forEach((btn) => {
      const handler = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()

        const parentDetails = btn.closest('details') as HTMLElement
        if (!parentDetails) return

        const id = parentDetails.id
        const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`

        navigator.clipboard
          ?.writeText(url)
          .then(() => {
            btn.classList.add('copied')
            setTimeout(() => {
              btn.classList.remove('copied')
            }, 1000)
          })
          .catch((err) => console.error('Copy failed:', err))

        e.stopPropagation()
      }

      btn.addEventListener('click', handler)
      copyHandlers.push(() => btn.removeEventListener('click', handler))
    })

    // Cleanup
    return () => {
      summaryHandlers.forEach((off) => off())
      copyHandlers.forEach((off) => off())
    }
  }, [])

  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkCollapseH2, [remarkGfm, { singleTilde: false }]]}
    >
      {content}
    </Markdown>
  )
}

export default EnhancedMarkdown
