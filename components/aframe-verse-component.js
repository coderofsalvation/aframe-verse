if( typeof $ == 'undefined' ) window.$ = (s) => document.querySelector(s)

AFRAME.registerComponent('href', {

  init: function(){
    let href   = this.data.http || this.data.https || this.data
    this.el.addEventListener("click", (e) => {
      if( this.loading ) return
      let averse = this.el.closest('[aframe-verse]').components["aframe-verse"]
      console.dir(averse)
      let dest = averse.findDestination(href)
      if( !dest ) throw `console.error: ${href} not in json register`
      this.loading = true
      let navigate = () => {
        if( dest.owntab ) return document.location.href = dest.url
        fetch(dest.url)
        .then( (res ) => res.text() )
        .then( (html) => new window.DOMParser().parseFromString(html, "text/html") )
        .then( (dom ) => {
          averse.el.innerHTML = dom.querySelector('a-scene > [aframe-verse]').innerHTML;
          if( averse.data.fade ) $('[fadebox]').components.fadebox.out()
          this.loading = false
        })
      }
      if( averse.data.fade ) $('[fadebox]').components.fadebox.in( navigate )
      else navigate()
    })

    this.el.setAttribute("class", (this.el.className+" "||"") + "hit") // make collidable
  }
})

AFRAME.registerComponent('aframe-verse', {

  schema:{
    register: {type:"string"}, 
    fade: {type:"boolean", "default":true}
  },

  registerJSON: function(url){
    if( !url ) return console.error("aframe-verse-component:register() no register found")
    fetch(url)
    .then( (res) => res.json() )
    .then( (json) => {
      this.el.emit('registerJSON', json)
      this.destinations = this.destinations.concat( json.destinations)
      json.verses.map( (verse) => this.registerJSON(verse) )
    })
    .catch( (e) => console.error(e) )
    return this
  }, 

  findDestination: function(url){
    let destinations = this.el.closest('[aframe-verse]').components['aframe-verse'].destinations
    return destinations.find( (d) => d.url == url ? d : false)
  }, 

  initDestination: function(){
  }, 

  initCamera: function(){
    let cam = $('[camera]')
    cam.setAttribute("fadebox", "fadetime:1500;"+$('a-scene').getAttribute("background") )
    cam.setAttribute("mouse-cursor", {})
    return this
  }, 

  register: function(){
    this.destinations = []
    this.initCamera()
        .registerJSON(this.data.register)
  }, 

  init: function(){
    if( this.data.register ) this.register()
    if( this.data.href     ) this.initDestination()
  }, 

});

AFRAME.registerComponent('fadebox', {
  schema:{
    fadetime:{type:"number"}, 
    color:{type:"color"}, 
  },
  init: function(){
    let fb = this.fb = document.createElement("a-box")
    fb.setAttribute("scale", "2 2 2")
    fb.setAttribute("material", `color: ${this.data.color}; transparent: true; side: back; shader: flat`)
    this.el.appendChild(fb)
    this.out()
  }, 
  out: function(cb){
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 1; to: 0`)
		clearTimeout(this.tid)
		this.tid = setTimeout( (cb) => {
      this.fb.setAttribute("visible",false)
      if( cb ) cb()
    }, this.data.fadetime*1.2, cb ) 
  }, 
  "in": function(cb){
    this.fb.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 0; to: 1`)
    this.fb.setAttribute("visible",true)
    if( cb ) setTimeout( cb, this.data.fadetime*1.2 )
  }
});
