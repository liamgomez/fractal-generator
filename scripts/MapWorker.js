// Functions return number from 0 to (maxIter-1)
var fractalFunctions = {
    'mandlebrot': function(cx, cy, maxIter) {
        var iter, xn, yn, x = 0, y = 0;
        for (iter = 0; iter < maxIter; iter++) {
            xn = x*x - y*y + cx;
            yn = (x*y)*2 + cy;
            if (xn*xn + yn*yn > 4) {
                break;
            }
            x = xn;
            y = yn;
        }
        
        return iter;
    },
    'julia': function(cx, cy, maxIter, cr, ci) {
        var iter, xn, yn, x = cx, y = cy;
        for (iter = 0; iter < maxIter; iter++) {
            xn = x*x - y*y + cr;
            yn = (x*y)*2 + ci;
            if (xn*xn + yn*yn > 4) {
                break;
            }
            x = xn;
            y = yn;
        }
        
        return iter;
    },
    'juliacubed' : function(x, y, maxIter) {
        var x0 = x, y0 = y;
        var iter;
        var xx = x*x, yy = y*y;
        var phi = 1.6180339887;
        for (iter = 0; iter < maxIter; iter++) {
            tx = x;
            ty = y;

            tx2 = x*x-y*y;
            ty2 = 2*x*y;

            x = tx2*tx-ty2*ty + 1-phi;
            y = tx2*ty+ty2*tx + 0.3;

            xx = x*x;
            yy = y*y;

            if (xx+yy > 4)
            {
                break;
            }
        }
        return iter;
    },
    'burningShip': function(cx, cy, maxIter) {
        var iter, xn, yn, x = 0, y = 0;
        for (iter = 0; iter < maxIter; iter++) {
            xn =  x*x - y*y - cx;
            yn = 2*Math.abs(x*y) + cy;
            if (xn*xn + yn*yn > 4) {
                break;
            }
            x = xn;
            y = yn;
        }
        
        return iter;
    },
    'multibrot4' : function(x, y, maxIt, er2) {
        var x0 = x, y0 = y;
        var xx = x*x, yy = y*y;
        var itt;
        for (itt = 0; itt < maxIt; itt++) {
            y = 2*x*y;
            x = xx - yy;
            yy = y*y;
            xx = x*x;
            y = 2*x*y + y0;
            x = xx - yy + x0;
            yy = y*y;
            xx = x*x;
            if (xx+yy > 4){
                break;
            }
        }

        return itt;
    },
    'multibrot3': function(cx, cy, maxIter) {
        var iter, xn, yn, x = 0, y = 0;
        for (iter = 0; iter < maxIter; iter++) {
            xn=Math.pow(x,3)-3*x*Math.pow(y,2) + cx;
            yn=3*Math.pow(x,2)*y-Math.pow(y,3) + cy;
            if (xn*xn + yn*yn > 4) {
                break;
            }
            x = xn;
            y = yn;
        }
        
        return iter;
    },
    'tricorn': function(cx, cy, maxIter) {
        var iter, xn, yn, x = 0, y = 0;
        for (iter = 0; iter < maxIter; iter++) {
            xn =  x*x - y*y - cx;
            yn =(x+x)*(-y) + cy;
            if (xn*xn + yn*yn > 4) {
                break;
            }
            x = xn;
            y = yn;
        }
        
        return iter;
    }
}

function workerFunc(data, cb) {

    // For cx / cy
    var scale = Math.pow(2, data.z - 1);
    var x_cords = data.x / scale - 1;
    var y_cords = data.y / scale - 1;
    var d = (scale << 8);

    /// other variables
    var MAX_ITER = data.maxIter;
    var paletteIndex, cx, cy, iterations, px, py;
    var func = fractalFunctions[data.type];
    // tile size = 256 rgb = 4 bits
    var bitmap = new Uint8ClampedArray(256 * 256 * 4);
    var pixelOffset = 0;
    for (var i = 0; i < 65536; i++) {
        px = i % 256;
        py = (i - px) >> 8;
        cx = x_cords + px / d;
        cy = y_cords + py / d;
        iterations = func(cx, cy, MAX_ITER, data.cr, data.ci);
        paletteIndex = ~~((iterations / MAX_ITER) * 255);
        var rgbArr = data.presetMap[paletteIndex];
        bitmap[pixelOffset] = rgbArr[0];
        pixelOffset++;
        bitmap[pixelOffset] = rgbArr[1];
        pixelOffset++;
        bitmap[pixelOffset] = rgbArr[2];
        pixelOffset++;
        bitmap[pixelOffset] = 255;
        pixelOffset++;
    }

    data.img.data.set(bitmap);

    return data.img;
}

self.onmessage = function (e) {
    var ctx_image = self.workerFunc(e.data);
    self.postMessage({ canvas_image: ctx_image });
};
