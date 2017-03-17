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