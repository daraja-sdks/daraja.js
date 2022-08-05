# Contributing

All contributions are welcome and highly appreciated. You can contribute in various ways:

- Opening an issue where applicable
- Contributing to documentation
- Fixing issues on github

# Style and convention

Tools used for enforcing the styles and convention used for the project include: `prettier`, `eslint`, `husky` and `conventional-commits`. If you plan to make contributions, we recommend setting up these tools on your system. Commits are linted to make sure they are conventional. This is required since we use the `semantic-release` package to automate the release process. You can learn more about conventional-commits [here](https://conventionalcommits.org).

# Getting Started

- Clone the repo:

```bash
git clone https://github.com/daraja-sdks/daraja.js
```

- Install deps:

```bash
npm install
```

If you are using vscode, we recommend installing the `prettier` and `eslint` extensions. Alternatively, you can choose to open the project in a devcontainer and this will setup everything for you. To use conventional-commits in vscode, install [this package](https://github.com/KnisterPeter/vscode-commitizen). After installing the package, you can use it to make commits by pressing the `F1` key and searching for the `commitizen` option. There are other solutions available if you are not using vscode. Checkout commitizen on [github](https://github.com/commitizen).

## Join the community

Join our community [discord server](https://discord.gg/hVvV5rfZ). There are dedicated channels for contributors and developers, you can find support there incase you encounter any issues while trying to make a change to the package

## Testing your changes

The package contains simple tests that verify its functionality. However, the Daraja API usually has internal problems on its own and this cannot be attributed as a failure when testing. Therefore, to get around this, whenever a response is recived from the server with a `500` response code, this is marked as a successfull test.

For more information on this package, refer to the documentation [here](https://daraja-sdks.github.io/en/impl/node) or visit the `node.js` channel on the discord server.
