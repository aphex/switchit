"use strict";

const Cmdlet = require('./Cmdlet');
const Commands = require('./Commands');

class Container extends Cmdlet {
    static defineAspect (name, value) {
        if (name === 'commands') {
            var items = this.commands;
            items.addAll(value);
        }
        else {
            super.defineAspect(name, value);
        }
    }

    static get commands () {
        return Commands.get(this);
    }

    //-----------------------------------------------------------

    get commands () {
        return this.constructor.commands;
    }

    dispatch (args) {
        var me = this;

        return new Promise((resolve, reject) => {
            me.configure(args);

            let arg = args.pull();

            if (!arg) {
                //TODO new HelpCommand().attach(me, "help").dispatch(arguments);
                args.ownerPop(me);
                resolve(0);
                return;
            }

            let entry = me.commands.lookup(arg);

            if (!entry) {
                args.ownerPop(me);
                reject(new Error(`No such command "${arg}"`)); //TODO full cmd path
                return;
            }

            let cmd = entry.create(me);

            cmd.dispatch(args).then(v => {
                cmd.destroy();
                args.ownerPop(me);

                if (args.pullConjunction(!me.parent) && !args.atEnd()) {
                    // If this command ended with an appropriate conjunction ("and" or
                    // "then" keyword) and there are more arguments to process, call
                    // back to our dispatch() method to go around again.
                    resolve(me.dispatch(args));
                } else {
                    resolve(v);
                }
            },
            err => {
                cmd.destroy();
                args.ownerPop(me);
                reject(err);
            });
        });
    }
}

Object.assign(Container, {
    isContainer: true,

    _commands: new Commands(Container)
});

Object.assign(Container.prototype, {
    isContainer: true
});

module.exports = Container;
