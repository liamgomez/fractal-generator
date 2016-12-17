L.GridLayer.FractalLayer = L.GridLayer.extend({
    options: {
        async: true,
        maxZoom:23,
        continuousWorld:true,
    },
    initialize: function (numWorkers, fractalType, maxIter, cr, ci) {
        this.fractalType = fractalType || "mandlebrot";
        this.numWorkers = numWorkers;
        this._workers = [];
        this.activeWorkers = 0;
        this.messages={};
        this.queue={total: numWorkers};
        this.cr = cr || -0.74543;
        this.ci = ci || 0.11301;
        this.maxIter = maxIter || 700;
        this._paletteName = null;
        this._paletteSended = false;
    },
/*
    createTile: function (coords) {
        var tile = document.createElement('canvas');
        var _this = this;
        console.log(_this.fractalType);
        var tileSize = this.getTileSize();

        tile.setAttribute('width', tileSize.x);
        tile.setAttribute('height', tileSize.y);

        var ctx = tile.getContext('2d');
        var data;
        var scale = Math.pow(2, coords.z - 1);
        var x0 = coords.x / scale - 1;
        var y0 = coords.y / scale - 1;
        var d = (scale << 8);
        var pixels = new Array(65536);
        var MAX_ITER = _this.maxIter;
        var c, cx, cy, iter, i = 0, px, py, a1, a2, a3, a4;
        var func = fractalFunctions[_this.fractalType];

        while (i < 65536) {
          px = i % 256;
          py = (i - px) >> 8;
          cx = x0 + px / d;
          cy = y0 + py / d;
          iter = func(cx, cy, MAX_ITER, _this.cr, _this.ci);
          c = ~~((iter / MAX_ITER) * 360);
          pixels[i++] = colors[c];
          pixels[i++] = colors[c];
        }
        i = 1;
        while (i < 65536) {
          px = i % 256;
          py = (i - px) >> 8;
          cx = x0 + px / d;
          cy = y0 + py / d;
          if (!px || !py || !px % 255 || py % 255) {
            iter = func(cx, cy, MAX_ITER, _this.cr, _this.ci);
            c = ~~((iter / MAX_ITER) * 360);
            pixels[i++] = colors[c];
          }
          else {
            a1 = pixels[i + 1];
            a2 = pixels[i - 1];
            a3 = pixels[i + 256];
            a4 = pixels[i - 256];
            if (a1 === a2 && a2 === a3 && a3 === a4) {
              i++;
            } else {
              iter = func(cx, cy, MAX_ITER, _this.cr, _this.ci);
              c = ~~((iter / MAX_ITER) * 360);
              pixels[i++] = colors[c];
            }
          }
          i++;
        }
        var array = new Uint32Array(pixels);
        var pixel_buffer = array.buffer;
        console.log(array);
        var yo = new Uint8ClampedArray(pixel_buffer);
        console.log(yo);
        var imagedata = ctx.getImageData(0, 0, 256, 256);
        imagedata.data.set(yo);
        ctx.putImageData(imagedata, 0, 0);
        // done(null, tile);

         map.on("zoomstart",function() {
            console.log("zooming");
        }, this);

        return tile;
    },
*/
    createTile: function (coords, done) {
        var tile = document.createElement('canvas');
        var _this = this;

        var tileSize = this.getTileSize();

        tile.setAttribute('width', tileSize.x);
        tile.setAttribute('height', tileSize.y);

        var ctx = tile.getContext('2d');
        var imagedata = ctx.getImageData(0, 0, 256, 256);
        var UintArray = imagedata.data;
        var worker = new Worker("./scripts/MapWorker.js");

        worker.postMessage({
            do: 'start',
            x: coords.x,
            y: coords.y,
            z: coords.z,
            maxIter: _this.maxIter,
            type: _this.fractalType,
            cr: _this.cr, 
            ci: _this.ci,
            img: UintArray
        }, [UintArray.buffer]);

        worker.onmessage = function (e) {
           ctx.putImageData(new ImageData(e.data.canvas_image, 256, 256), 0, 0);
           worker.terminate();
           worker = undefined;
           done(null, tile);
        };

        return tile;
    },
});

L.gridLayer.fractalLayer = function(numWorkers, t, mi, cr, ci){
    return new L.GridLayer.FractalLayer(numWorkers, t, mi, cr, ci);
}