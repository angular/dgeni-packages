# Releasing

## Steps

1. Bump the version in the primary branch
2. Run `yarn changelog --version-number {version}` and extract the new entry
   from `changes.md` into the actual `CHANGELOG.md`
3. Create a pull request, merge it.
4. Tag the new commit with the corresponding `v{version}` tag.
5. Run `yarn prepublish`
6. Publish using Wombat with `--registry=https://wombat-dressing-room.appspot.com`
