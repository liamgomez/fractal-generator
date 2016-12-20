var map = L.map('fractal_map', {minZoom:1});
map.setView([0, -90], 2); 
var numWorkers = 3;

var fractalController = {
    appControls: {
        type: 'mandlebrot',
        customColors: false,
        fractalColor1: [ 194, 232, 18 ],
        fractalColor2: [49,209,133],
        fractalColor3: [255,147,79],
        fractalColor4: [98,30,244],
        juliaCR: -0.74543,
        juliaCI: 0.11301,
        maxItt: 300,
        colorPreset:'orange'
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
};

// Setup Dat Gui
window.onload = function() {
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
        'grayscale',
        'orange',
        'blue',
        'rainbow',
        'wobniar',
        'test',
        'YourColor'
    ]);

    var customColors = gui.add(fractalController.appControls, 'customColors');
    var colorCont1 = gui.addColor(fractalController.appControls, 'fractalColor1');
    var colorCont2 = gui.addColor(fractalController.appControls, 'fractalColor2');
    var colorCont3 = gui.addColor(fractalController.appControls, 'fractalColor3');
    var colorCont4 = gui.addColor(fractalController.appControls, 'fractalColor4');
    var juliaMaxItt = gui.add(fractalController.appControls, 'maxItt', 1, 1000).step(5);;
    var juliaCICont = gui.add(fractalController.appControls, 'juliaCI', -2.0, -0.01);
    var juliaCRCont = gui.add(fractalController.appControls, 'juliaCR', 0.1, 1);

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