# Passwd-ws

A web service to demonstrate a minimal HTTP service by exposing the user and group information on a UNIX-like system.

## System Requirements

OS: macOS 10.12.6 or higher or Ubuntu 16.04 or higher
Node.js: 6.0 or higher
Optional: Visual Studio Code, Postman

## NodeJS Install Instructions for Ubuntu

Before installing nodejs, we will need refresh the local package index first, and then install from the repositories:

```
sudo apt-get update
```

Since the default supported version of nodejs is v4.2.6, to get more recent version of Node.js we will need to add a PPA (personal package archive) maintained by NodeSource by running the following command:

```
cd ~
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
```

After adding the PPA to your configuration, your local package cache will be updated automatically.  You will be able to get the newer version of Node.js:

```
sudo apt-get install nodejs
```

To check the version of Node.js along and the node package manager, run the following command:

```
nodejs -v

npm -v
```

## Cloning project

Pull the code:

```
git clone https://github.com/jsulm/passwd-ws.git passwd-ws
```

Before running the server, you will need to be in the directory where package.json is located, and then run the command to install the supporting packages:

```
cd passwd-ws
sudo npm install
```


## Usage

To run the unit test, you will need to be in the directory where package.json is located. Then run the command:

```
npm test
```

To stop the unit test, use 'Ctrl + C'.

To run the server, you will need to cd into the main directory and run the node command:

```
cd passwd-ws/main
node server.js
```

To stop the server, use 'Ctrl + C'.
