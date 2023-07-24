<!--lint disable first-heading-level-->

# ACDH-CH Learning resources

## View content

Visit the website at [https://howto.acdh.oeaw.ac.at](https://howto.acdh.oeaw.ac.at).

## Contribute content

### Contribute or edit content via CMS

Sign-in to the CMS via [https://howto.acdh.oeaw.ac.at/cms]. You'll need a GitHub account and be a
member of the [ACDH-CH GitHub organization](https://github.com/acdh-oeaw/).

For edits to articles you can also directly click the "Suggest changes to this resource" links at
the bottom of each post.

### Run a local CMS backend

1. Clone this repository. See above (green Code button).
   `git clone https://github.com/acdh-oeaw/howto`
2. You of course need a nodejs setup. See nodejs.org about your options. Currently we use nodejs
   18.x
3. This project uses yarn. Yarn is part of any current nodejs distribution but has to be enabled
   with `corepack enable`
4. Install dependencies: `yarn install`.
   - If you work with multiple copies/branches of howto, please remember you need to do this for
     every directory you work in
5. We recommend you run a local CMS backend which writes directly to the filesystem, and does not
   require authentication.
6. To apply the correct styles to the CMS preview, you will have to run `yarn cms:styles` once. On
   Windows please run `yarn cms:styles-win`.
7. Now you can run a development build with
   `yarn dev`.
8. You may be prompted to allow firewall access for node.exe on Windows. Please allow that on at
   least private networks.
9. Visit [http://localhost:3000/cms](http://localhost:3000/cms)

Alternatively you can
* start the CMS in one console (start the local cms with `yarn cms:dev`) and
* then run a production build of the website (does not work on Windows yet) with
  `NEXT_PUBLIC_USE_LOCAL_CMS='true' yarn build && yarn start`.

Please be patient starting the services will take a while.

Don't forget to commit and push changes via `git`.

### Use your favorite text editor

Since content is saved to `.mdx` files in the `content/posts` folder, you can use your favourite
text editor to make changes and commit via git. When using VS Code you can install the recommended
extensions to get linting aud auto-formatting for markdown.

### Contributing guidelines

When contributing content directly via git, please use feature branches and don't push to `main`, to
allow for review.

### Note on writing Markdown

Content is saved in MDX format, which is markdown with custom JavaScript components. Most markdown
syntax is supported, however there are
[subtle parsing differences](https://github.com/micromark/mdx-state-machine#72-deviations-from-markdown)
to be aware of. Most notably: the "lesser than" sign `<` needs to be HTML-escaped to `&lt;` (because
it signifies the start of a custom component), and similarly "autolinks" (`<https://example.com>`
instead of `[https://example.com](https://example.com)`) are not allowed.

# Troubleshooting:

## The dev cms does not work

Indication: [http://localhost:3000/cms](http://localhost:3000/cms) still displays a GitHub login
button instead of a simple button only labled `Login`.

You will see this if you

- are either not running `yarn cms:dev` as a background service or
- especially on Windows some system service uses port 8081 (IP Helper Windows service).

Solution: Change the cms port. In `package.json` look for the two mentions of port 8081 and change
it to some unused port.
[Here is a utility to list all ports in use at the moment on Windows.](https://www.nirsoft.net/utils/cports.html)

## The service is not reachable at all

Indication: You access [http://localhost:3000/](http://localhost:3000/) and nothing happens, the
browser seems stuck or dispalys an error message.

There is probably also a service running on port 3000 on your computer.

Solution: look for `--port=3000` in `package.json` and change that to a different number e.g. 34567.
After you stopped and restarted the dev server it will display the URL to use
[http://localhost:34567/](http://localhost:34567/)
