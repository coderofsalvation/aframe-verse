if( typeof $ == 'undefined' ) window.$ = (s) => document.querySelector(s)

AFRAME.registerComponent('href', {
  getVerse: function(){
    return this.el ? this.el.components["aframe-verse"] || this.el.closest('[aframe-verse]').components["aframe-verse"]
                   : $('[aframe-verse]').components['aframe-verse']
  }, 
  emitPromise: function(e, opts, averse){ // emitting promises instead of data allows more control for listeners
    return new Promise( (resolve, reject) => {
      opts.promise = () => {
        opts.promise.halted = true
        return { resolve, reject }
      }
      (averse || this.getVerse()).el.emit(e, opts)     
      if( !opts.promise.halted ) resolve()
    })
  }, 
  teleport: function(e, href){
    href   = href || this.data.http || this.data.https || this.data
    let averse = this.getVerse()
    if( averse.loading ) return

    let dest = {url:"./index.html"}         // default: return to home / origin verse
    dest = href == '/' ? {url:'/'} : averse.findDestination(href)
    if( !dest ) throw `console.error: ${href} not in json register`
    let ctx = {el:averse,  destination:dest }
    averse.loading = true

    let navigate = () => {
      this.emitPromise('navigate',ctx)
          .then(  (e) => this.loadURL(averse, dest) )
          .catch( console.warn ) 
    }

    this.emitPromise('beforeNavigate', ctx)
        .then( () => {
          if( averse.data.fade != 0 ) $('[fader]').components.fader.in( navigate )
          else navigate()
        })
  }, 
  init: function(){
    setTimeout( () => {
      let events = this.getVerse().data.hrefEvents
      events.map( (e) => this.el.addEventListener(e, (e) => this.teleport(e) ) )
      this.el.setAttribute("class", (this.el.className?this.el.className+" ":"") + "hit") // make collidable
    }, 200 )
  }, 

  loadURL: function(averse, dest){
    if( dest.newtab ) return document.location.href = dest.url
    let gohome = ( dest.url == '/' )
    if( gohome ){
      dest.url = "./index.html"
      averse.setBaseHref( document.location.origin+document.location.pathname )
    }
    fetch(dest.url)
    .then( (res ) => res.text() )
    .then( (html) => new window.DOMParser().parseFromString(html, "text/html") )
    .then( (dom ) => {
      dest.dom = dom
      if( !gohome ) averse.setBaseHref( dest.url )
      return this.emitPromise('loadHTML',{destination:dest, gohome})
    })
    .then( () =>  averse.el.innerHTML = dest.dom.querySelector('[aframe-verse]').innerHTML )
    .catch( (e) => console.error(e) )
    .finally( () => {
      this.emitPromise('loaded',{destination:dest,gohome},averse)
      .then( () => {
        averse.loading = false
        if( averse.data.fade != 0 ) $('[fader]').components.fader.out()
      })
    })
  } 

})

AFRAME.registerComponent('aframe-verse', {

  schema:{
    debug:      {type:"boolean", "default":false}, 
    register:   {type:"string"}, 
    hrefEvents: {type:"array", "default":["click","collide"]},
    fade:       {type:"number", "default":1000}, 
    fadeColor:  {type:"string"}
  },

  registerJSON: function(url){
    if( !url ) return console.error("aframe-verse-component:register() no register found")
    fetch(url)
    .then( (res) => res.json() )
    .then( (json) => {
      json.destinations = json.destinations.map( (d) => {
        if( url.substr(0, 2) != "./" && String(d.url).substr(0, 2) == './' ){ // make absolute url
          let rooturl = url.split("/")
          rooturl.pop()
          d.url = rooturl.join("/") + "/apps/" + d.url.substr(2)
        }
        if( this.data.debug ) console.log("indexing "+d.url)
        return d
      })
      this.el.emit('registerJSON', {json} )
      this.destinations = this.destinations.concat( json.destinations)
      json.verses.map( (verse) => this.registerJSON(verse) )
      console.dir(this.destinations)
    })
    .catch( (e) => console.error(e) )
    return this
  }, 

  findDestination: function(url){
    let url_rel = $('base').getAttribute("href") + url
    console.dir(this.el.closest('[aframe-verse]'))
    let destinations = this.el.closest('[aframe-verse]').components['aframe-verse'].destinations
    return destinations.find( (d) => d.url == url ? d : null )
  }, 

  setBaseHref: function(url, absolute){
    let base = url.split("/")
    if( !absolute ){
      if( !this.el.isEqualNode( $('[aframe-verse]') ) ) 
        return // only first aframe-verse can set base href
      base.pop()
      base = base.join("/") +"/"
    } else base = url
    if( base != '.' ) $('base').setAttribute("href", base)
  }, 


  initCamera: function(){
    let cam = $('[camera]')
    if( !cam.getAttribute('fader') ){
      cam.setAttribute("fader",`fadetime: ${this.data.fade}; color: ${this.data.fadeColor||'black'}`);
      cam.setAttribute("mouse-cursor", {})
    }
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

AFRAME.registerComponent('fader', {
  schema:{
    fadetime:{type:"number"}, 
    color:{type:"color","default":"black"}, 
    entity:{type:"selector"}, 
  },
  init: function(){
    let f = this.fader = this.data.entity ? this.data.entity : document.createElement("a-box")
    f.setAttribute("scale", "0.5 0.5 0.5")
    f.setAttribute("material", `color: ${this.data.color}; transparent: true; side: back; shader: flat`)
    console.log(`color: ${this.data.color}; transparent: true; side: back; shader: flat`)
    this.el.appendChild(f)
    this.out()
  }, 
  out: function(cb){
    this.fader.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 1; to: 0`)
		clearTimeout(this.tid)
		this.tid = setTimeout( (cb) => {
      this.fader.setAttribute("visible",false)
      if( cb ) cb()
    }, this.data.fadetime*1.2, cb ) 
  }, 
  "in": function(cb){
    this.fader.setAttribute("animation", `property: components.material.material.opacity; dur: ${this.data.fadetime}; from: 0; to: 1`)
    this.fader.setAttribute("visible",true)
    if( cb ) setTimeout( cb, this.data.fadetime*1.2 )
  }
});

AFRAME.registerComponent('wearable', {
  schema:{
    el: {type:"selector"}, 
    position: {type:"array"}, 
    rotation: {type:"array"} 
  }, 
  init: function(){
    console.log("wearable")
    console.dir(this.data)
    $('a-scene').addEventListener('enter-vr', (e) => this.wear(e) )
    $('a-scene').addEventListener('exit-vr',  (e) => this.unwear(e) )
  }, 
  wear: function(){
    if( !this.old ){
      this.old = {}
      this.old.parent = this.el.parentElement
      this.old.position = this.el.getAttribute("position")
      this.old.rotation = this.el.getAttribute("rotation")
    }
    let el  = this.data.el
    let pos = this.data.position
    let rot = this.data.rotation

    this.el.setAttribute("visible", false)
    el.object3D.add( this.el.object3D )

//    el.appendChild(this.el)
//    el.setAttribute("position", `${pos[0]} ${pos[1]} ${pos[2]}`)
//    el.setAttribute("rotation", `${rot[0]} ${rot[1]} ${rot[2]}`)
  }, 
  unwear: function(){
//    this.old.parent.appendChild(this.el)
//    let opos = this.old.position
//    let orot = this.old.rotation
//    this.el.setAttribute("position", `${opos.x} ${opos.y} ${opos.z}`)
//    this.el.setAttribute("rotation", `${orot.x} ${orot.x} ${orot.z}`)
  }
})
