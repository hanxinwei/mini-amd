(() => {

    var __concat_defs__ = 
{
        


script2: () => {
    define(['script4', 'script5', 'script6'], function (script4, script5) {
    console.log('script2');
});
},


script4: () => {
    define([], function () {
    console.log('script4');
});
},


script5: () => {
    define([], function () {
    console.log('script5');
});
},


script3: () => {
    define(['script6', 'script7'], function () {
    console.log('script3');
});
},


script6: () => {
    define([], function () {
    console.log('script6');
});
},


script6: () => {
    define([], function () {
    console.log('script6');
});
},


script7: () => {
    define([], function () {
    console.log('script7');
});
},


}    
;

    var modules = {}, currentDeps, currentDef, currentIsRoot = true;

    var defToContent = (id) => {

        var module = modules[id];

        var deps = module.deps;
        var def = module.def;

        if (deps.length === 0 || deps.every(function (dep) {
            return modules[dep].state === 'content';
        })) {
            var depContents = deps.map(function (dep) {
                return modules[dep].content;
            });
            module.content = def.apply(window, depContents);
            module.state = 'content';
        }
    }

    var defToContentRecursive = (id) => {
        defToContent(id);
        var module = modules[id];
        if (module.state === 'content' && module.sups && module.sups.length > 0) {
            module.sups.forEach(function (sup) {
                defToContentRecursive(sup);
            });
        }
    }

    var finishDefine = (id) => {

        var module = modules[id];

        module.state = 'def';
        module.def = currentDef;
        module.deps = currentDeps;

        module.deps.forEach(function (dep) {
            var depModule = modules[dep];
            depModule.sups.push(id);
        });

        defToContentRecursive(id);

    }

    var insertScript = (id) => {
        var script = document.createElement('script');
        script.src = id + '.js';
        script.onload = () => {
            finishDefine(id);
        }
        document.head.appendChild(script);
    }

    var insertScriptSync = (id) => {
        setTimeout(function () {
            __concat_defs__[id]();
            finishDefine(id);
        }, 0);
    }

    var define = (id, deps, def) => {

        if (def === undefined) {
            def = deps;
            deps = id;
            id = undefined;

            currentDeps = deps;
            currentDef = def;
        }

        deps.forEach((dep) => {


            if (modules[dep] === undefined) {

                if (window.__mini_amd__ && window.__mini_amd__.mockNetworkLatency
                    && !__concat_defs__) {
                    var timeout = Math.random() * window.__mini_amd__.mockNetworkLatency;
                    setTimeout(() => {
                        insertScript(dep);
                    }, timeout);
                }
                else if (__concat_defs__) {
                    insertScriptSync(dep);
                }
                else {
                    insertScript();
                }

                modules[dep] = {
                    id: dep,
                    state: 'loading',
                    sups: []
                }
            }
        });

        if (currentIsRoot) {
            modules['entry'] = {
                id: 'entry',
                deps: deps.concat([]),
                def: def
            }
            modules['entry'].deps.forEach(function (dep) {
                var depModule = modules[dep];
                depModule.sups.push('entry');
            });
            currentIsRoot = false;
        }
    }


    window.define = define;

    setTimeout(() => {
        if (window.__mini_amd__ && window.__mini_amd__.debug) {
            window.__mini_amd__.modules = modules;
        }
    }, 0);


})();

try {
    window.__mini_amd__ = {
        mockNetworkLatency: 5000,
        debug: true,
    }
}
catch (ex) {

}

define(['script2', 'script3'], function (script2, script3) {
    console.log('index');
});