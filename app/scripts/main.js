var test = {
    type: 'mandlebrot',
    backgroundColor: [ 0, 128, 255 ],
    fractalColor1: [ 0, 128, 255 ],
    fractalColor2: [ 0, 128, 255 ]
};


// Setup Dat Gui
window.onload = () => {

    let gui = new dat.GUI();
    let appControls = test;
    // Choose from accepted values
    gui.add(appControls, 'type', [ 'mandlebrot', 'julia'] );
    gui.addColor(appControls, 'backgroundColor');
    gui.addColor(appControls, 'fractalColor1');
    gui.addColor(appControls, 'fractalColor2');
};
//# sourceMappingURL=main.js.map
