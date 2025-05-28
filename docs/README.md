# `@syltek/syltek/embeddable-vanilla-components`

## What is this repo?

This repo is a fork of [`@embeddable.com/vanilla-components`](https://www.npmjs.com/package/@embeddable.com/vanilla-components) published as [`@syltek/syltek/embeddable-vanilla-components`](https://github.com/syltek/embeddable-vanilla-components/pkgs/npm/embeddable-vanilla-components) onto [npm Github Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## How to use it?

Add `@syltek/syltek/embeddable-vanilla-components` as a dependency to your package. It is recommended you grab the latest version from [here](https://github.com/syltek/embeddable-vanilla-components/pkgs/npm/embeddable-vanilla-components/versions).

New versions are published every time `main` or an open PR is updated. Stable changes (i.e: changes merged onto `main`) are released marked as `rc` while unstable changes (i.e: Pull Requests) are released marked as `pr`.

### Working _locally_ with a repo that depends onto this one

This is the main use case when working with [embeddable](https://github.com/syltek/embeddable). Let's say you are making changes onto this repo; but you want them reflected onto that one.

Any local-development techniques (such as package linking, bundling and installing the zipped bundle…) would work; but in general those require some knowledge on how the dependency resolution for nodejs application work.

Instead, we recommend you just open a PR here. The PR will trigger a run of the [pre-release publish](https://github.com/syltek/embeddable-vanilla-components/actions) workflow. Once that finishes the job summary will include a version you can install onto [embeddable](https://github.com/syltek/embeddable) and test the changes.

## How to upgrade from the upstream?

We refer to the default [embeddable vanilla components](https://github.com/embeddable-hq/vanilla-components-v1) as the _upstream_.

From time to time we will want to merge their available new features and fixes into this fork. Here is a quick cheatsheet of the commands to do that:

```bash
git remote add -f embeddable git@github.com:embeddable-hq/vanilla-components-v1.git
git checkout main
git merge emebeddable/main
```

## Motivation

We really like emeddable vanilla components; but we had some needs that were not properly covered:

- lack of i18n support
- missing "fine-grained" customizations on some dropdown elements (like the options available within the DateRangePicker)

After some internal discussion and conversations with the embeddable team; we decided to fork the repo and
