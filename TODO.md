- next-xdm
- recma-minify

- <button> => useButton

- https://github.com/akebifiky/remark-simple-plantuml
- https://github.com/benchmark-urbanism/remark-bibtex
- https://github.com/ptigas/gatsby-remark-bibliography

- search field: onChange or onSubmit?

- floating TOC

- use HomePageParamsInput etc in routes.config.ts

- clean up translations (e.g. pluralize stuff like resources/resource)

- remove unnecessary data from json payloads

- make getId() helper function in `@/cms/api/*.apt.ts`, which knows when to
  trimEnd('/index')

- optimize svg icon usage (i.e. don't inline everything, e.g. in search results)

- unify routes: tag+tags, resource+resources etc!

- should /tag/:id (and /author/:id) page list curricula?

---

Type '(tree: Node, file: VFile) => Promise<void>' is not assignable to type
'Transformer'. Type 'Promise<void>' is not assignable to type 'void | Node |
Promise<Node | undefined> | Error | undefined'. Type 'Promise<void>' is not
assignable to type 'Promise<Node | undefined>'. Type 'void' is not assignable to
type 'Node | undefined'.ts(2322)

remark-reading-time as any

types in cms widgets

a11y: webkit does not announce `<ul>` as lists when it has css style list-style:
none. get around this by explicitly settings `<ul role="list>`.
