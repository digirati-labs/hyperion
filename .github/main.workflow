workflow "Hyperion" {
  on = "push"
  resolves = ["Yarn tests"]
}

action "Yarn install" {
  uses = "docker://node:8"
  args = "yarn install"
}

action "Yarn tests" {
  uses = "docker://node:8"
  args = "yarn test"
  needs = ["Yarn install"]
}
