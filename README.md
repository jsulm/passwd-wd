# Passwd-ws

A web service to demonstrate a minimal HTTP service by exposing the user and group information on a UNIX-like system.

### System Requirements

  -  OS: macOS 10.12.6 or higher or Ubuntu 16.04 or higher
  -  Node.js: 6.0 or higher
  -  Optional Tools: Visual Studio Code, Postman

### Node.js Install Instructions for Ubuntu

Before installing Node.js, we will need refresh the local package index:

```sh
sudo apt-get update
```

Since the default supported version of Node.js is v4.2.6 on Ubuntu, to get more recent version of Node.js we will need to add a PPA (personal package archive) maintained by NodeSource.

To add a PPA, first change to your home directory and then use curl to retrieve the installation script for the preferred version of Node.js:

```sh
cd ~
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
```

After getting the script run the following command:

```sh
sudo bash nodesource_setup.sh
```

The script will add the PPA to your configuration and your local package cache will be updated automatically.  You will be able to get the newer version of Node.js with the standard apt-get command:

```sh
sudo apt-get install nodejs
```

To check the version of Node.js, along and the node package manager, run the following command:

```sh
nodejs -v

npm -v
```

### Usage

Clone the repository to your selected directory:

```sh
git clone https://github.com/jsulm/passwd-ws.git passwd-ws
```

After cloning the repository, you will need to be in the directory where package.json is located, and then run the command to install the supporting packages:

```sh
cd passwd-ws
sudo npm install
```

To run the unit test, you will need to be in the directory where package.json is located. Then run the command:

```sh
npm test
```

To stop the unit test, use 'Ctrl + C'.

To run the server, you will need to cd into the main directory and run the node command:

```sh
cd passwd-ws/main
node server.js
```

To stop the server, use 'Ctrl + C'.
