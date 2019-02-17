//workflow "Build and test" {
//  on = "push"
//  resolves = ["Yarn tests", "Typescript types tests"]
//}

workflow "Deploy pre-release to NPM" {
  on = "pull_request"
  resolves = ["Deploy prerelease"]
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
  secrets = ["NPM_AUTH"]
}
