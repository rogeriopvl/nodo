# Nodo

## About

Nodo is a command line todo application that can be used with the [Wunderlist][0] database. And this means that Nodo can be a command line interface for Wunderlist if you configure it to use that database.

Nodo is developed with node.js and a sqlite3 database.

The name "Nodo" comes from the mix of Node and Todo.

## Install

Nodo is available as a package in the npm registry, so you can install it with:

    npm install -g nodo

The first time you run Nodo, it creates a config file `~/.nodorc` in your home folder.

### Using Wunderlist database
You need to edit that file and make sure that the database location is correct. If you want to use the Wunderlist database, you need to edit the database.location. For example in Mac OSX, the Wunderlist database file is at `~/Library/Wunderlist/wunderlist.db`, so just make your config file look like this:

    {
        "database": {
            "location": "~/Library/Wunderlist/wunderlist.db",
        }
    }

And you'll be all set to organize your day like a hacker!

### Using local database

If you don't want or don't use Wunderlist, you can start a local database from scratch. Although I seriously recommend Wunderlist, because it's an awesome app, and you get it also on mobile with sync included.

To create a local database you need to run a different command:

    nodo-install-db

This creates a new sqlite3 database and respective tables, ready to be used.

You can rename and/or move you database file as long as you update your config file to reflect it's current location.

## Usage

    Usage: nodo <action> [arguments]

      Available actions and options:
        nodo show                        Show all lists and tasks todo
        nodo show all                    Same as above
        nodo show lists                  Show all lists and number of tasks in each one.
        nodo show <list_name>            Show content of list
        nodo show done                   Show all done tasks
        nodo show deleted                Show all deleted tasks
        nodo show task <task_id>         Show detail of a task

        nodo add list <list_name>        Add a new list
        nodo add <list_name> <task_name> Add a new task to list

        nodo done <task_id>              Mark a task as done
        nodo undo <task_id>              Mark a task as not done

        nodo move <task_id> <list_name>  Moves a task to a list

        nodo remove list <list_name>     Delete list
        nodo remove task <task_id>       Delete task

        nodo restore <task_id>           Restore task
        nodo restore task <task_id>      Restore task
        nodo restore list <list_name>    Restore list

## Bug Report

Nodo is in it's early versions. If you find any problems using Nodo, please report them back to me by opening an issue on Github.

[0]: http://wunderlist.com
