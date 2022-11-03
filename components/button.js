AFRAME.registerComponent('button', {
    schema: {
        label: {
            default: 'label'
        },
        width: {
            default: 0.11
        },
        toggable: {
            default: false
        }, 
        color:{
            default: '#3a50c5'
        }, 
        hicolor:{
            default: '#555555'
        }
    },
    init: function() {
        var el = this.el;
        var labelEl = this.labelEl = document.createElement('a-entity');
        this.color = this.data.color 
        el.setAttribute('geometry', {
            primitive: 'box',
            width: this.data.width,
            height: 0.05,
            depth: 0.01
        });
        el.setAttribute('material', {
            color: this.color
        });
        el.setAttribute('pressable', '');
        labelEl.setAttribute('position', '0 0 0.02');
        labelEl.setAttribute('text', {
            value: this.data.label,
            color: 'white',
            align: 'center'
        });
        labelEl.setAttribute('scale', '0.75 0.75 0.75');
        this.el.appendChild(labelEl);
        this.bindMethods();
        this.el.addEventListener('stateadded', this.stateChanged);
        this.el.addEventListener('stateremoved', this.stateChanged);
        this.el.addEventListener('pressedstarted', this.onPressedStarted);
        this.el.addEventListener('pressedended', this.onPressedEnded);
        this.el.addEventListener('mouseenter', (e) => this.onMouseEnter(e) );
        this.el.addEventListener('mouseleave', (e) => this.onMouseLeave(e) );
    },
    bindMethods: function() {
        this.stateChanged = this.stateChanged.bind(this);
        this.onPressedStarted = this.onPressedStarted.bind(this);
        this.onPressedEnded = this.onPressedEnded.bind(this);
    },
    update: function(oldData) {
        if (oldData.label !== this.data.label) {
            this.labelEl.setAttribute('text', 'value', this.data.label);
        }
    },
    stateChanged: function() {
        var color = this.el.is('pressed') ? this.data.hicolor : this.color;
        this.el.setAttribute('material', {
            color: color
        });
    },
    onMouseEnter: function(){
        this.el.setAttribute('material', { color: this.data.hicolor });
    }, 
    onMouseLeave: function(){
        this.el.setAttribute('material', { color: this.color });
    }, 
    onPressedStarted: function() {
        var el = this.el;
        el.setAttribute('material', {
            color: this.data.hicolor
        });
        el.emit('click');
        if (this.data.togabble) {
            if (el.is('pressed')) {
                el.removeState('pressed');
            } else {
                el.addState('pressed');
            }
        }
    },
    onPressedEnded: function() {
        if (this.el.is('pressed')) {
            return;
        }
        this.el.setAttribute('material', {
            color: this.color
        });
    }
});
