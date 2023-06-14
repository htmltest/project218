window.onload = function() {
    var html = document.documentElement;

    var fontsfile = document.createElement('link');
    fontsfile.href = pathTemplate + 'css/fonts.css';
    fontsfile.rel = 'stylesheet';
    document.head.appendChild(fontsfile);

    if (sessionStorage.fontsLoaded) {
        html.classList.add('fonts-loaded');
        window.setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 500);
    } else {
        var script = document.createElement('script');
        script.src = pathTemplate + 'js/fontfaceobserver.js';
        script.async = true;

        script.onload = function () {
            var Raleway400 = new FontFaceObserver('Raleway', {
                weight: 'normal'
            });
            var Raleway500 = new FontFaceObserver('Raleway', {
                weight: '500'
            });
            var Raleway600 = new FontFaceObserver('Raleway', {
                weight: '600'
            });

            Promise.all([
                Raleway400.load(),
                Raleway500.load(),
                Raleway600.load()
            ]).then(function () {
                html.classList.add('fonts-loaded');
                sessionStorage.fontsLoaded = true;
                window.setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 500);
            });
        };
        document.head.appendChild(script);
    }
}