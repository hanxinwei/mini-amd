var fs = require('fs');

var defs = [], count = 0, count2 = 0, globalEntry, amdOutput, entryOutput;

var getDefOutput = (id, define) => {
    return `
${id}: () => {
    ${define}
},
`;
}

var finishRead = () => {
    defs.unshift(`
{
        
`);
    defs.push(`
}    
`);

    var defsOutput = defs.join(`
`);

    fs.readFile('./mini-amd.js', 'utf8', (err, data) => {
        amdOutput = data.replace('__concat_defs__', '__concat_defs__ = ' + defsOutput);
        output();
    });
    fs.readFile(`./${globalEntry}.js`, 'utf8', (err, data) => {
        entryOutput = data;
        output();
    });

}

var output = () => {
    if (amdOutput && entryOutput) {
        fs.writeFile(`./${globalEntry}.concat.js`, amdOutput + '\n\n' + entryOutput);
    }
}

var readModule = (id) => {
    count++;
    fs.readFile('./' + id + '.js', 'utf8', function (err, data) {
        defs.push(getDefOutput(id, data));
        count--;
        if (count === 0) {
            finishRead();
        }
    });
}

global.define = (id, deps, def) => {

    if (def === undefined) {
        def = deps;
        deps = id;
        id = undefined;
    }

    deps.forEach(function (dep) {
        readModule(dep);
        require(`./${dep}.js`);
    });

}
var concat = (entry) => {
    globalEntry = entry;
    require(`./${entry}.js`);
}

module.exports = concat;