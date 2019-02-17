workflow "Hyperion" {
  on = "push"
  resolves = ["Yarn tests", "Typescript types tests", "Deploy prerelease"]
}

action "Yarn install" {
  uses = "docker://node:8"
  args = "yarn install"
}

action "Yarn build" {
  uses = "docker://node:8"
  args = "yarn build"
  needs = ["Yarn install"]
}

action "Yarn tests" {
  uses = "docker://node:8"
  args = "yarn test"
  needs = ["Yarn build"]
}

action "Typescript types tests" {
  uses = "docker://node:8"
  args = "yarn test-types"
  needs = ["Yarn install"]
}


action "Deploy prerelease" {
  uses = "stephenwf/module-release-action@master"
  env = {
    MODULE_RELEASE_DEBUG = "true"
  }
  needs = ["Yarn tests", "Typescript types tests"]
  secrets = ["NPM_AUTH"]
}
