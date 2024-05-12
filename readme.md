# app howto

deployed at <https://howto.acdh.oeaw.ac.at>.

## how to run

prerequisites:

- [node.js v20](https://nodejs.org/en/download)
- [pnpm v9](https://pnpm.io/installation)

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

adjust environment variables in `.github/workflows/validate.yml` and
`.github/workflows/build-deploy.yml`.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

## how to deploy

set `KUBE_NAMESPACE` repository variable to the acdh-ch kubernetes namespace to deploy to. every git
push to the `main` branch should trigger a deployment if the validation pipeline passes.
