# Contributing

This project uses automated releases with semantic versioning based on conventional commits.

## Commit Guidelines

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced via git hooks using commitlint.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature (triggers a minor release)
- **fix**: A bug fix (triggers a patch release)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A performance improvement (triggers a patch release)
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Breaking Changes

To trigger a major release, add `BREAKING CHANGE:` in the commit footer, or add `!` after the type:

```
feat!: drop support for Node 16

BREAKING CHANGE: Node 16 is no longer supported
```

## Making Commits

### Option 1: Using Commitizen (Recommended)

Run the interactive commit helper:

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

### Option 2: Manual Commits

If you commit manually, ensure your message follows the conventional commit format:

```bash
git commit -m "feat: add new Firefly operation"
```

The commit-msg hook will validate your message and reject it if it doesn't follow the format.

## Release Process

Releases are **fully automated**:

1. Make your changes and commit using conventional commits
2. Push to the `main` branch (or merge a PR)
3. GitHub Actions will:
   - Run linting and build
   - Analyze commit messages since the last release
   - Determine the next version number (major, minor, or patch)
   - Update version in `package.json`
   - Generate/update `CHANGELOG.md`
   - Create a git tag
   - Publish to NPM under `@musallam/n8n-nodes-firefly-services`
   - Create a GitHub release with release notes

### Version Bumps

- **Patch** (0.1.0 → 0.1.1): `fix:` commits
- **Minor** (0.1.0 → 0.2.0): `feat:` commits
- **Major** (0.1.0 → 1.0.0): Commits with `BREAKING CHANGE:` in footer or `!` after type

### No Release

Commits that don't trigger a release (chore, docs, style, refactor, test, build, ci) won't create a new version.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build the project
npm run build
```

## Testing Your Setup

You can test semantic-release locally (dry run):

```bash
npx semantic-release --dry-run --no-ci
```

This will show you what version would be released based on your commits, without actually publishing.

## GitHub Secrets

The following secrets must be configured in GitHub:

- `NPM_TOKEN`: NPM access token for publishing to `@musallam` org
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Tips

1. Keep commits focused and atomic
2. Write clear, descriptive commit messages
3. Use the `commit` script if you're unsure about the format
4. Check the CHANGELOG.md after each release to see what was included
5. Review the GitHub release notes for a summary of changes
