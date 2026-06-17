# GitHub Actions Workflows

These workflow files should be placed in `.github/workflows/` to enable CI/CD.

Copy them:
```bash
mkdir -p .github/workflows
cp .github-workflows/*.yml .github/workflows/
```

Then push with a token that has the `workflow` scope.

## Workflows

| File | Trigger | Description |
|---|---|---|
| `ci.yml` | Push / PR to `main`, `develop` | Lint, typecheck, test, build, security audit |
| `release.yml` | Push tag `v*` | Publish npm packages + create GitHub Release |
| `codeql.yml` | Push `main` / weekly | CodeQL static analysis security scan |
