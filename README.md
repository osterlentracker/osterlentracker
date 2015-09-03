# Österlentracker

[![npm](https://travis-ci.org/osterlentracker/osterlentracker.svg?branch=master)](https://travis-ci.org/osterlentracker/osterlentracker)

# Contribution

If you would like to assist by contributing in making the code more efficent
follow the steps below. The only thing you won't be able to do is receive lightning data
since it comes from blitzortung.

# Installation

clone project into folder and run following commands

```bash
$ npm install
$ jspm install
$ cp config/app.default.json config/app.json
```
# Configuration

Modify config/app.json and fill in all empty fields with proper values. You do not have to fill in
the following fields.

* Blitzortung

# Running server

```bash
$ bin/cakejs server
```

# Testing

```bash
$ bin/cakejs test
```

# Extra links

[CakeJS CookBook](https://book.cakejs.net) - Backend Framework

[Aurelia Documentation](http://aurelia.io/docs.html) - Frontend Framework
