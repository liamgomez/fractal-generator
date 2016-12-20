var map = L.map('fractal_map', {
    minZoom:1,
    fullscreenControl: {
        pseudoFullscreen: false
    }
});
map.setView([0, -90], 2); 
var numWorkers = 3;

var fractalController = {
    appControls: {
        type: 'mandlebrot',
        customColors: true,
        fractalColor1: randomColor({luminosity: 'random', format: 'rgbArray'}),
        fractalColor2: randomColor({luminosity: 'random', format: 'rgbArray'}),
        fractalColor3: randomColor({luminosity: 'random', format: 'rgbArray'}),
        fractalColor4: randomColor({luminosity: 'random', format: 'rgbArray'}),
        juliaCR: -0.74543,
        juliaCI: 0.11301,
        maxItt: 300,
        colorPreset:'YourColor'
    },

    activeLayer: null,
    currentType: null,

    setLayer: function(type) {
        if ( this.activeLayer) {
            this.activeLayer.remove();
        }
        this.activeLayer = L.gridLayer.fractalLayer(this.appControls);
        this.currentType = type;
        this.activeLayer.addTo(map);
    },
    reloadLayer: function() {
        this.activeLayer.remove();
        this.activeLayer = L.gridLayer.fractalLayer(this.appControls);
        this.activeLayer.addTo(map);
    },
    randomizeColors: function() {
        this.appControls.fractalColor1 = randomColor({luminosity: 'random', format: 'rgbArray'});
        this.appControls.fractalColor2 = randomColor({luminosity: 'random', format: 'rgbArray'});
        this.appControls.fractalColor3 = randomColor({luminosity: 'random', format: 'rgbArray'});
        this.appControls.fractalColor4 = randomColor({luminosity: 'random', format: 'rgbArray'});
        this.reloadLayer();
    },
    resetZoom: function() {
        map.setView([0, -90], 2); 
    }
};

// Setup Dat Gui
window.onload = function() {
    console.log(randomColor({luminosity: 'bright', format: 'rgbArray'}));
    var gui = new dat.GUI({autoPlace: false});
    var rightPane = document.getElementById('controls');
    rightPane.appendChild(gui.domElement);

    // Choose from accepted values
    var controller = gui.add(fractalController.appControls, 'type', [
        'mandlebrot',
        'julia',
        'burningShip',
        'multibrot3',
        'multibrot4',
        'juliacubed'
    ]);
    var presetController = gui.add(fractalController.appControls, 'colorPreset', [
        'YourColor',
        'grayscale',
        'orange',
        'blue',
        'rainbow',
        'wobniar',
        'test'
    ]);

    var customColors = gui.add(fractalController.appControls, 'customColors');
    var colorCont1 = gui.addColor(fractalController.appControls, 'fractalColor1').listen();
    var colorCont2 = gui.addColor(fractalController.appControls, 'fractalColor2').listen();
    var colorCont3 = gui.addColor(fractalController.appControls, 'fractalColor3').listen();
    var colorCont4 = gui.addColor(fractalController.appControls, 'fractalColor4').listen();
    var juliaMaxItt = gui.add(fractalController.appControls, 'maxItt', 1, 1000).step(5);;
    var juliaCICont = gui.add(fractalController.appControls, 'juliaCI', -2.0, -0.01);
    var juliaCRCont = gui.add(fractalController.appControls, 'juliaCR', 0.1, 1);
    gui.add(fractalController, 'randomizeColors');
    gui.add(fractalController, 'resetZoom');

    // Handle fractal selection changes 
    controller.onFinishChange(function(value) {
        fractalController.setLayer(value);
        map.setView([0, -90], 2);
    });
    customColors.onFinishChange(function() {
        fractalController.reloadLayer();
    });
    // Handle color schemes
    colorCont1.onFinishChange(function() {
        if(fractalController.appControls.colorPreset == 'YourColor') {
            fractalController.reloadLayer();
        }
    });
    colorCont2.onFinishChange(function() {
        if(fractalController.appControls.colorPreset == 'YourColor') {
            fractalController.reloadLayer();
        }
    });
    colorCont3.onFinishChange(function() {
        if(fractalController.appControls.colorPreset == 'YourColor') {
            fractalController.reloadLayer();
        }
    });
    colorCont4.onFinishChange(function() {
        if(fractalController.appControls.colorPreset == 'YourColor') {
            fractalController.reloadLayer();
        }
    });
    juliaMaxItt.onFinishChange(function() {
        fractalController.reloadLayer();
    });
    juliaCICont.onFinishChange(function() {
        if (fractalController.currentType == 'julia') {
            fractalController.reloadLayer();
        }
    });
    juliaCRCont.onFinishChange(function() {
        if (fractalController.currentType == 'julia') {
            fractalController.reloadLayer();
        }
    });
    presetController.onFinishChange(function(){
        fractalController.reloadLayer();
    });

    // set default layer
    fractalController.setLayer('mandlebrot');
};