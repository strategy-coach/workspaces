# Opinionated Dev Workspaces Infrastructure

## Quick start

1. Use `ws-ensure.ts` in this repo and create a `ws-ensure.ts` file in the root of your workspaces.
2. Execute `deno run -A ./ws-ensure.ts` to idempotently clone and update your workspace repositories.

## Governed directory structure

`mGit workspaces` are managed by either GitHub or cloud/on-premise GitLab or any other supplier which offers HTTPs based Git repository management. `mGit` strategy allows multiple (single) repos to act as a _monorepo_ with respect to retrieving and managing repositories using Visual Studio Code. While `mGit` does not, strictly, *require* VS Code, `mGit` commands/tasks use the VS Code `*.code-workspaces` file format (specifically the `folders` property) to define which paths will participate as an `mGit` _monorepo_.

A very specific, strictly enforced, convention is used to structure "managed" Git workspaces (repos) in the current directory where each Git manager (e.g. github.com or git.company.io) has a home path under workspaces and the repos from that server are placed in the exact same directory structure as they appear in the home server (e.g. github.com or git.company.io). For GitHub, there is only github.com/org/repo combination but for GitLab there can be unlimited depth like git.company.io/group1/subgroup1/repo.

```fish
❯ tree -d -L 4 (pwd)
└── workspaces
    ├── github.com
    │   ├── shah
    │   │   ├── uniform-resource
    │   └── netspective-labs
    │       └── home-polyglot
    └── gitlab.company.io
        └── gitlab-group-parent
            └── child
                └── grandchild
                    ├── repo1
                    └── repo2
```     

## Making content updates across multiple GitHub repos

[git-xargs](https://github.com/gruntwork-io/git-xargs) is a command-line tool (CLI) for making updates across multiple Github repositories with a single command. `git-xargs` is not installed by default but if you need it, you can install it yourself for one-off use or let our team know and we'll have it installed as a standard `home-polyglot` package.

## Windows 11 Dev Infrastructure

Use the
[Windows Package Manager](https://learn.microsoft.com/en-us/windows/package-manager/)
to install our minimum dependencies, namely Git and Deno:

```psh
$ winget install Git.Git deno
```

These are optional but are very helpful for Windows development:

```psh
$ winget install Microsoft.Powershell Microsoft.WindowsTerminal
```

## Linux Dev Infrastructure

TODO: Add notes

## MacOS Dev Infrastructure

TODO: Add notes

### Governed VS Code `.code-workspace` files (optional)

`mGit` tasks use VS Code `*.code-workspace` files whose folders assume that the `*.code-workspace` file is in the current directory root. This allows Visual Studio Code users to set their folders for all Git managers relative to the current directory as the root. 

With this feature, VSC workspaces are all fully portable using relative directories and can easily mix repos from different Git managers (e.g. GitHub, GitLab) to form a kind of _monorepo_.

For example, to produce the structure shown above the following `my.code-workspace` can be used:

```json
{
  "folders": [
    {
      "path": "github.com/netspective-labs/sql-aide"
    },
    {
      "path": "github.com/opsfolio/resource-surveillance"
    },
    {
      "path": "gitlab.company.io/gitlab-group-parent/child/grandchild/repo1"
    },
    {
      "path": "gitlab.company.io/gitlab-group-parent/child/grandchild/repo2"
    }
  ],
  "settings": {
    "git.autofetch": true
  }
}
```