# Nodo [![Build Status](https://travis-ci.org/rogeriopvl/nodo.png)](https://travis-ci.org/rogeriopvl/nodo)

## About

Nodo is a command line TODO application that uses a portable database file. Also, if you are a [Wunderlist][0] user, you can configure Nodo to be a command line interface to Wunderlist's database (only for version 1.* of Wunderlist).

The name "Nodo" comes from the mix of the words Node and TODO.

### Screencast Demo
[![Nodo Demo Video](https://i.vimeocdn.com/video/539197203.webp?mw=1920&mh=1080&q=70)](https://vimeo.com/42330826)

## Install

Nodo is available as a package in the npm registry, so you can install it with:

    npm install -g nodo

At install, Nodo creates a default configuration file (`~/.nodorc`) and a default local database (`~/.nodo.db`) with some sample tasks just to get you started.
You can rename and/or move you database file as long as you update your config file to reflect it's current location.

### Using Wunderlist database (only for Wunderlist 1.*)

*Important:* Nodo is not compatible with Wunderlist 2. And I don't plan to fix this in the near future unless there's high demand.

I you wan't to use the Wunderlist database with Nodo you need to edit the config file and make sure that the database location parameter has the Wunderlist database file path. For instance in Mac OSX, the Wunderlist database file is at `~/Library/Wunderlist/wunderlist.db`, so just make your config file look like this:

    {
        "database": {
            "location": "~/Library/Wunderlist/wunderlist.db",
        }
    }

And you'll be all set to organize your day like a hacker!

*Important:* Nodo does not delete any data in the Wunderlist database. Even if you delete tasks, they are just marked as deleted, and can be recovered with the `nodo restore` command.

## First Run

On the first run nodo asks your permission to anonymously track some usage patterns. This is very useful to improve nodo, but completely optional and anonymous. Only major commands like `show`, `help`, `list`, etc are tracked. Their respective arguments are not tracked.

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

        nodo star <task_id>              Mark a task as important
        nodo unstar <task_id>            Mark a task as not important

        nodo move <task_id> <list_name>  Moves a task to a list

        nodo delete list <list_name>     Delete list
        nodo delete task <task_id>       Delete task

        nodo restore <task_id>           Restore task
        nodo restore task <task_id>      Restore task
        nodo restore list <list_name>    Restore list

## Bug Report

Nodo is in it's early versions. If you find any problems using Nodo, please report them back to me by opening an issue on Github.

## Credits

Thanks to:

* Pedro Faria, for his precious help in debugging Nodo on Linux.

[0]: http://wunderlist.com
