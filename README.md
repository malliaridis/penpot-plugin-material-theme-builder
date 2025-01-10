# Material Theme Builder

This is a penpot plugin that allows you to generate and manage Material theme
assets.

## Getting Started

For a detailed getting started tutorial, read
[Getting Started](docs/getting-started.md).

## Usage

To start using this plugin, add the following URL to your plugin manager:

```
https://penpot.malliaridis.com/manifest.json
```

For more information on how to add plugins, refer to
[penpot plugins - Getting started](https://help.penpot.app/plugins/getting-started/).

## Features

- Create Material 3 theme assets, including colors _and typography (planned)_
  from a source color _or image (planned)_
- Manage multiple themes and switch between them on the fly
- Configure the theme colors used and switch between light and dark theme for
  selected shapes or entire pages
- Replace existing theme values with values from other themes

Note that the current version does not support custom colors put into the theme
groups.

## Permissions

This plugin manages library assets and optionally applies them to your content.
Therefore, both library and content write permissions are needed.

## Development

This repository is based on the
[penpot/penpot-plugin-starter-template](https://github.com/penpot/penpot-plugin-starter-template).
If you need help getting started with the plugin development, the README.md of
the template project is a great starting point.

### Pre-requisites

- Node.js and npm
- Git

### Setup

Once you have cloned the repository, install the necessary dependencies:

```bash
npm install
```

Then you can run the development server with:

```bash
npm run dev
```

Once the server is running, open your web browser and go to
`http://localhost:4400` to view your plugin in action. Now it is ready to be
loaded in Penpot with the url `http://localhost:4400/manifest.json`.

### Deployment

This plugin is automatically deployed on GitHub pages.

## Contributing

If you find any bug or have a feature request, feel free to create a new
GitHub issue. You are also welcome to create a pull request and request changes.

## Licensing

This project is licensed under the MIT License. For information about
third-party dependencies and their licenses, see the [NOTICE file](./NOTICE).
