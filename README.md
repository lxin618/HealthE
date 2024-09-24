# HealthE

# Getting Started

## Step 1: Start the Server

the server is set up to listen on port 1111
so you will have http://localhost:1111

```bash
# start your mongodb server first (you might need to install it first)
brew services start mongodb-community@7.0

# using npm to start the node server with mongodb
npm run dev

```

### Repo info

Repo is setup with github action which pushed to AWS elastic beanstalk on releasing a new version. (Update to terrafrom files will not trigger wrokflow)
Instead, update to terraform files in `/iac` folder will trigger terraform plan and apply automactially which will be deployed to AWS beanstalk

### Useful doc:

non-monolith Nginx folder setup - https://gist.github.com/sanrandry/bd4350a591f62eb259e48cd9fbfcd642
initial set-up using ssh with ec2 directly - https://github.com/kalyansaxena/nodejs-restapi-ec2
