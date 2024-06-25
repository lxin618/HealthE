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
variable "vpc_id" {
  type = string
}
variable "public_subnets" {
    type = list(string)
}
variable "Instance_type" {
  type = string
}
variable "minsize" {
  type = number
}
variable "maxsize" {
  type = number
}
variable "elb_public_subnets" {
  type = list(string)
}
variable "elb_security_group" {
  type = string
}
variable "SSLCertificateId" {
  type = string
}