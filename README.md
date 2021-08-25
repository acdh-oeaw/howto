<!--lint disable first-heading-level-->

# ACDH-CH Learning resources

## View content

Visit the website at
[https://howto.acdh-dev.oeaw.ac.at](https://howto.acdh-dev.oeaw.ac.at).

## Contribute content

### Contribute or edit content via CMS

Sign-in to the CMS via [https://howto.acdh-dev.oeaw.ac.at/cms]. You'll need a
GitHub account and be a member of the
[ACDH-CH GitHub organization](https://github.com/acdh-oeaw/).

For edits to articles you can also directly click the "Suggest changes to this
resource" links at the bottom of each post.

### Run a local CMS backend

You can run a local CMS backend which writes directly to the filesystem, and
does not require authentication, with `yarn cms:dev`. Then run either a
production build of the website with
`NEXT_PUBLIC_USE_LOCAL_CMS='true' yarn build && yarn start` or a development
build with `yarn dev` and visit
[http://localhost:3000/cms](http://localhost:3000/cms). To apply the correct
styles to the CMS preview, you will have to run `yarn cms:styles` once. Don't
forget to commit and push changes via `git`.

### Use your favorite text editor

Since content is saved to `.mdx` files in the `content/posts` folder, you can
use your favourite text editor to make changes and commit via git. When using VS
Code you can install the recommended extensions to get linting aud
auto-formatting for markdown.

### Contributing guidelines

When contributing content directly via git, please use feature branches and
don't push to `main`, to allow for review.

### Note on writing Markdown

Content is saved in MDX format, which is markdown with custom JavaScript
components. Most markdown syntax is supported, however there are
[subtle parsing differences](https://github.com/micromark/mdx-state-machine#72-deviations-from-markdown)
to be aware of. Most notably: the "lesser than" sign `<` needs to be
HTML-escaped to `&lt;` (because it signifies the start of a custom component),
and similarly "autolinks" (`<https://example.com>` instead of
`[https://example.com](https://example.com)`) are not allowed.
