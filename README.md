````markdown
# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Content Management

This site uses [Decap CMS](https://decapcms.org/) for content management. Access the CMS at `/admin/` after deployment.

See [DECAP_CMS_SETUP.md](./DECAP_CMS_SETUP.md) for detailed setup instructions.

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
pnpm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true pnpm deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

````
