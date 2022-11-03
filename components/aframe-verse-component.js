if( typeof $ == 'undefined' ) window.$ = (s) => document.querySelector(s)

AFRAME.registerComponent('href', {
  getVerse: function(){
    return this.el.components["aframe-verse"] || this.el.closest('[aframe-verse]').components["aframe-verse"]
  }, 
  emitPromise: function(e, opts){ // emitting promises instead of data allows more control for listeners
    return new Promise( (resolve, reject) => {
      opts.promise = () => {
        opts.promise.halted = true
        return { resolve, reject }
      }
      this.getVerse().el.emit(e, opts)     
      if( !opts.promise.halted ) resolve()
    })
  }, 
  init: function(){
    let href   = this.data.http || this.data.https || this.data
    let handler  = (e) => {
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
            if( averse.data.fade != 0 ) $('[fadebox]').components.fadebox.in( navigate )
            else navigate()
          })
    }
    setTimeout( () => {
      let events = this.getVerse().data.hrefEvents
      events.map( (e) => this.el.addEventListener(e, handler ) )
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
      if( !gohome ) averse.setBaseHref( dest.url )
      this.emitPromise('loadHTML',{destination:dest, dom, gohome})
          .then( () =>  averse.el.innerHTML = dom.querySelector('[aframe-verse]').innerHTML )
          .catch( console.warn ) 
    })
    .catch( (e) => console.error(e) )
    .finally( () => {
      averse.loading = false
      if( averse.data.fade != 0 ) $('[fadebox]').components.fadebox.out()
    })
  } 

})

AFRAME.registerComponent('aframe-verse', {

  schema:{
    debug:      {type:"boolean", "default":false}, 
    register:   {type:"string"}, 
    fade:       {type:"number", "default":1000}, 
    hrefEvents: {type:"array", "default":["click"]}
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
    })
    .catch( (e) => console.error(e) )
    return this
  }, 

  findDestination: function(url){
    let url_rel = $('base').getAttribute("href") + url
    let destinations = this.el.closest('[aframe-verse]').components['aframe-verse'].destinations
    return destinations.find( (d) => {
      let result  = false
      if( String(d.url).replace(/(http|https):/, '') == url     ) result = d
      if( String(d.url).replace(/(http|https):/, '') == url_rel ) result = d
      return result
    })
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
    if( !cam.getAttribute('fadebox') ){
      cam.setAttribute("fadebox", `fadetime: ${this.data.fade}; `+$('a-scene').getAttribute("background") )
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

AFRAME.registerComponent('fadebox', {
  schema:{
    fadetime:{type:"number"}, 
    color:{type:"color"}, 
  },
  init: function(){
    let fb = this.fb = document.createElement("a-box")
    fb.setAttribute("scale", "0.5 0.5 0.5")
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
