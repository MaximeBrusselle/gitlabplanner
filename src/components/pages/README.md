# Gitlab Planner

This project is a sprint planning tool built with [Astro](https://astro.build), [Flowbite](https://flowbite.com), [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com) that helps teams focus on execution rather than excessive planning. It provides a simple and efficient interface for managing time across different apps in a project, allowing you to spend less time organizing and more time getting work done.

---

## Table of Contents

<!-- <details><summary>Click to expand</summary> -->

- [🚀 Built with Astro, React and Tailwindcss](#-built-with-astro-react-and-tailwindcss)
- [🏢 Use with your team](#-use-with-your-team)
- [📊 Gather insights](#-gather-insights)
- [💻 Host on your own server](#-host-on-your-own-server)
- [📚 Documentation](#-documentation)
- [👨‍🚀 Development](#-development)
  - [⚙️ Workflow](#️-workflow)
  - [🚀 Quick start](#-quick-start)
  - [📂 Project Structure](#-project-structure)
  - [🛠 Tools](#-tools)
- [🛜 Browser Support](#-browser-support)
- [📦 Resources](#-resources)
- [📝 Reporting Issues](#-reporting-issues)
- [⁉️ Technical Support or Questions](#-technical-support-or-questions)
- [🪪 Licensing](#-licensing)
- [🔗 Useful Links](#-useful-links)
- [👨‍🚀 Authors](#-authors)

<!-- </details> -->

---

## 🚀 Built with Astro, React and Tailwindcss

This application leverages the power of [Astro](https://astro.build)'s multi-framework capabilities, combining [React](https://react.dev) components for interactive features with [Tailwind CSS](https://tailwindcss.com) for a polished, responsive design. Astro's static site generation ensures blazing-fast page loads while allowing us to ship minimal JavaScript only where needed. The result is a modern, performant sprint planning tool that provides a seamless user experience across all devices.

## 🏢 Use with your team

This sprint planning tool makes it easy to collaborate with your team across multiple applications and projects. Whether you're managing tasks in Jira, code reviews in GitLab, or documentation in Confluence, you can seamlessly plan your sprints in one unified view. The intuitive interface allows team members to quickly log their activities and get visibility into how time is being allocated across different apps and projects, helping maintain focus and productivity throughout the sprint cycle.


## 📊 Gather insights

Gather insights from your team's time spent across different apps and projects. Track completion rates, identify bottlenecks, and optimize productivity. By having a insight in how your team is spending their time, you can make better decisions and improve your sprints.

## 💻 Host on your own server

Host this project on your own server or use the pre-configured GitHub Actions workflow to deploy to GitHub Pages. Simply clone the repository and then install the dependencies. Configure the .toml file to point to your own cloudflare D1 database and configure Clerk.

## 📚 Documentation

There is documentation available in the [docs](./docs). The docs have an in-depth explanation of the project and how to use it.

## 👨‍🚀 Development

### ⚙️ Workflow

This product is built using the following widely used technologies:

- Astro: [astro.build](https://astro.build/)
- Clerk: [clerk.com](https://clerk.com/)
- Cloudflare: [cloudflare.com](https://cloudflare.com/)
- Drizzle: [drizzle.dev](https://drizzle.dev/)
- Flowbite: [flowbite.com](http://flowbite.com/)
- React: [react.dev](https://react.dev/)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com/)

### 🚀 Quick start

1. Clone this repository or download the ZIP file
2. Make sure that you have **Node.js** and NPM, PNPM or Yarn installed
3. Install the project dependencies from the `package.json` file:

```sh
pnpm install
# or
npm install
# or
yarn
```
4. Configure the .toml file to point to your own cloudflare D1 database
5. Configure Clerk with your own API keys
6. Launch the Astro local development server on `localhost:4321` by running the following command:

```sh
npm run dev
```

You can also build the project and get the distribution files inside the `dist/` folder by running:

```sh
npm run build
```

Then, you can preview the generated build with a local web server:

```sh
npm run preview
```

For deployment, see the GitHub workflow, where you can plug your target (pre-configured for GitHub pages).
See [docs.astro.build/en/guides/deploy](https://docs.astro.build/en/guides/deploy)

Website is configured for server-side rendering, but you can flip it to **Static deployment** by simply
changing the `output` in the `./astro.config.mjs` to `static`.

---

### 📂 Project Structure

After cloning this repository, you'll find the following (simplified) structure:

```sh
🛬
├── 💧 public
│   └── **/*.svg                        # Static assets
│
└── 📂 src
    │
    ├── 🌠 assets
    │   └── **/*.{svg,…}                # Transformable assets
    │
    ├── 🧱 components
    │   └── **/*.{astro,tsx}            # Simple, atomic UI elements
    │
    ├── 📘 content
    │   └── **/*.{md,mdx}               # Markdown content
    │
    ├── 🌸 css
    │   └── **/*.css                    # Global styles
    │
    ├── ⚡ db
    │   └── **/*.ts                     # Database configuration
    │
    ├── 🌐 i18n
    │   └── **/*.ts                     # Internationalization
    │
    ├── 🌆 layouts
    │   └── **/*.{astro,ts}             # Layout components
    │
    ├── 🚀 Pages
    │   └── **/*.astro                  # Route components
    │
    ├── 📐 types
    │   └── *.ts                        # Data entities typings
    │
    └── ⚒️ utils
        └── **/*.ts                     # Utility functions
```

### 🛠 Tools

Efforts have been put on fast **onboarding** and **developer experience**.

This project comes with extensive support for TypeScript, Astro, Tailwind, and VS Code.  
It is configured with sensible defaults, a bit of opinions, plus some tricks to make it plays nice together.

- **TypeScript**: _strict_ Astro settings. Full-stack, type-safe code base
- **ESLint**: featuring `astro-eslint-parser` + `eslint-plugin-astro`
- **Prettier**: featuring `prettier-plugin-astro` (bundled with `astro`)
- **Editorconfig**: conforming with prettier
- **VS Code**: extensions recommendations, tooling settings
- **Tailwind**: Astro integration (using Vite and PostCSS)
- **Flowbite**: dependencies (core, typography), settings
- **GitHub**: a [pre-configured workflow](https://github.com/themesberg/flowbite-astro-admin-dashboard/tree/main/.github/workflows) for deployment (using PNPM cache)

## 🛜 Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<div align="center" class="flex justify-between w-full">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1280px-Google_Chrome_icon_%28February_2022%29.svg.png" width="64" height="64"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1280px-Firefox_logo%2C_2019.svg.png" width="64" height="64"> <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png" width="64" height="64"> <img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg" width="64" height="64"> <img src="https://upload.wikimedia.org/wikipedia/commons/3/37/Arc_%28browser%29_logo.svg" width="64" height="64">
</div>

## 📦 Resources
- Astro documentation: <https://docs.astro.build/>
- Clerk documentation: <https://clerk.com/docs/>
- Cloudflare documentation: <https://developers.cloudflare.com/d1/>
- Drizzle documentation: <https://orm.drizzle.team/>
- Flowbite documentation: <https://flowbite.com/docs/getting-started/introduction/>
- React documentation: <https://react.dev/>
- Tailwind CSS documentation: <https://tailwindcss.com/>
- Issues: [Github Issues Page](https://github.com/maximebrusselle/gitlabplanner/issues)

## 📝 Reporting Issues

We use GitHub Issues as the official bug tracker for Gitlab Planner. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of Gitlab Planner. Check the CHANGELOG from your dashboard on the [GitHub releases page](https://github.com/maximebrusselle/gitlabplanner/releases).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.

## ⁉️ Technical Support or Questions

If you have questions or need help integrating the product please [contact us](./contact) instead of opening an issue.

## 🪪 Licensing

- ©️ Maxime Brusselle [(https://github.com/maximebrusselle)](https://github.com/maximebrusselle)
- Open-source under the [MIT License](https://github.com/maximebrusselle/gitlabplanner/LICENSE)

## 🔗 Useful Links

- 📚 [Documentation](./docs) - Detailed documentation of the project
- 📞 [Contact](./contact) - Contact form
- 📝 [Issues](https://github.com/maximebrusselle/gitlabplanner/issues) - Report an issue
- 📜 [License](https://github.com/maximebrusselle/gitlabplanner/LICENSE) - License

## 👨‍🚀 Authors

- [Maxime Brusselle](https://github.com/maximebrusselle)
