// const {
//         Command,
//         Container
//     } = require('switchit');

const {
        Arguments,
        Command,
        Container,
        Help
    } = require('../index.js');

function delay (ms) {
    return new Promise(resolve => {
        setTimeout(x => resolve(), ms);
    });
}


class Commit extends Command {
    execute (params) {
        console.log(`${this.fullName}... "${params.message}"`, params);

        return delay(100).then(() => {
            console.log('tick');
            return 42;
        });
    }
}

Commit.define({
    help: 'Commits current changes',
    
    switches: {
        message: {
            help: 'The commit message',
            value: ''
        }
    }
});

//------------------------------------------

class Fetch extends Command {
    execute (params) {
        console.log(`${this.name}... "${params.remote}"`);
    }
}

Fetch.define({
    help: 'Fetches changes from a remote',

    parameters: 'remote'
});

//------------------------------------------

class Pull extends Command {
    execute (params) {
        console.log(`${this.name}... "${params.remote}/${params.branch}"`);
    }
}

Pull.define({
    help: 'Pulls changes from a remote branch',

    parameters: 'remote [branch:string=master]'
/*    parameters: [{
        name: 'remote'
    }, {
        name: 'branch',
        type: 'string', // the default (could be "number" or "boolean")
        value: ''
    }]*/
});

//------------------------------------------

class Git extends Container {
    //
}

Git.define({
    title: 'git',
    commands: {
        '?': 'help',

        help: Help,
        commit: Commit,
        fetch: {
            type: Fetch
        },
        pull: {
            type: Pull
        }
    }
});

const git = new Git();

//console.log(process.argv);

if (process.argv.length > 2) {
    //console.log(process.argv.slice(2));

    git.run(process.argv.slice(2)).then(v => {
        console.log('exit', v);
    });
}
else {
    console.log('aa', process.argv);

    git.run('commit', '-m', 'foobar', 'and', 'commit').then(v => {
        console.log('result', v);
    });

    console.log('bb');
}
