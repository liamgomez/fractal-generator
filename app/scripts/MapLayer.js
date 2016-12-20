L.GridLayer.FractalLayer = L.GridLayer.extend({
    options: {
        maxZoom:23,
        noWrap: true,
        updateInterval: 100
    },

    initialize: function (appControls) {
        this.fractalType = appControls.type;
        this.cr = appControls.juliaCR;
        this.ci = appControls.juliaCI;
        this.maxIter = appControls.maxItt;

        // initialize color palatte
        this.colors = [];
        this.colors.push(appControls.fractalColor1);
        this.colors.push(appControls.fractalColor2);
        this.colors.push(appControls.fractalColor3);
        this.colors.push(appControls.fractalColor4);
        this.customColors = appControls.customColors;

        /**
         * These are RGB arrays not RGBA. The fourth entry is used in the
         * generate color function to determine a colors frequency.
         * [r,g,b,0] - [r,g,b,9] 
         * would be 10 (scaled) occurences in 256 entry array.
         */
        var presets = {
            'grayscale': [
                [0, 0, 0, 255]
            ],
            'orange': [
                [255, 255, 127, 0],
                [255, 127, 0, 63],
                [191, 0, 0, 127],
                [0, 0, 0, 255]
            ],
            'test': [
                [ 255, 147, 79 ],
                [ 194, 232, 18 ],
                [ 182, 239, 212 ],
                [0, 255, 255, 63],
                [0, 0, 255, 95],
                [127, 0, 255, 127],
                [255, 255, 255, 254],
                [0, 0, 0, 255]
            ],
            'blue': [
                [63, 63, 255, 0],
                [255, 127, 0, 63],
                [191, 0, 0, 127],
                [0, 0, 0, 255]
            ],
            'rainbow': [
                [127, 0, 255, 0],
                [0, 0, 255, 31],
                [0, 255, 255, 63],
                [0, 255, 0, 95],
                [255, 255, 0, 127],
                [255, 0, 0, 191],
                [0, 0, 0, 255]
            ],
            'wobniar': [
                [255, 0, 0, 0],
                [255, 255, 0, 15],
                [0, 255, 0, 39],
                [0, 255, 255, 63],
                [0, 0, 255, 95],
                [127, 0, 255, 127],
                [255, 255, 255, 254],
                [0, 0, 0, 255]
            ],
            'YourColor': [
            ],
        };

        var custAdj1 = appControls.fractalColor1;
        var custAdj2 = appControls.fractalColor2;
        var custAdj3 = appControls.fractalColor3;
        var custAdj4 = appControls.fractalColor4;

        // TODO: Randomize these distributions, or have it be user configurable
        custAdj1.push(0);
        custAdj2.push(80);
        custAdj3.push(160);
        custAdj4.push(255);

        presets['YourColor'].push(custAdj1);
        presets['YourColor'].push(custAdj2);
        presets['YourColor'].push(custAdj3);
        presets['YourColor'].push(custAdj4);


        this.presetMap = this.generateColors(presets[appControls.colorPreset]);
    },
    createTile: function (coords, done) {
        var tile = document.createElement('canvas');
        var _this = this;

        var tileSize = this.getTileSize();

        tile.setAttribute('width', tileSize.x);
        tile.setAttribute('height', tileSize.y);

        var ctx = tile.getContext('2d');
        var imagedata = ctx.getImageData(0, 0, 256, 256);

        var map = this.colorMap;
        var worker = new Worker('./scripts/MapWorker.js');
            var c = _this.colorMap;
            worker.postMessage({
                do: 'start',
                x: coords.x,
                y: coords.y,
                z: coords.z,
                maxIter: _this.maxIter,
                type: _this.fractalType,
                cr: _this.cr, 
                ci: _this.ci,
                img: imagedata,
                customColors: _this.customColors,
                presetMap: _this.presetMap
            });

        worker.onmessage = function (e) {
           ctx.putImageData(e.data.canvas_image, 0, 0);
           worker.terminate();
           worker = undefined;
           done(null, tile);
        };

        return tile;
    },
    generateColors: function(points) {
        var map = [];
        var r = 255, g = 255, b = 255;
        for (var level = 0; level < points.length; level++) {
            var r_next = points[level][0];
            var g_next = points[level][1];
            var b_next = points[level][2];
            var end = points[level][3];
            var start = map.length;
            for (var i = start; i < end; i++) {
                var scale = (i - start) / (end - start);
                map[i] = [(r * (1 - scale) + r_next * scale)|0,
                                         (g * (1 - scale) + g_next * scale)|0,
                                         (b * (1 - scale) + b_next * scale)|0];
            }
            r = r_next;
            g = g_next;
            b = b_next;
        }
        map.push([r, g, b]);
        return map;
    }
});

L.gridLayer.fractalLayer = function(appControls){
    return new L.GridLayer.FractalLayer(appControls);
}