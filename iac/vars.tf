variable "elasticapp" {
  type = string
  default = "healthe-staging"
}
variable "beanstalkappenv" {
  type = string
  default = "Healthe-staging-env"
}
variable "solution_stack_name" {
  type = string
  default = "Node.js 20 running on 64bit Amazon Linux 2023"
}
variable "tier" {
  type = string
  default = "WebServer"
}