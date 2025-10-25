````markdown
# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Content Management

This site uses a **custom Discord-authenticated CMS** with role-based access control and a TipTap markdown editor. Users authenticate via Discord and submit changes as Pull Requests.

**Access the CMS:** `/dashboard`

**Setup:** See [ENV_SETUP.md](./ENV_SETUP.md) for environment variable configuration.

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
