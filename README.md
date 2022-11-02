## AFRAME-verse, deadsimple immersive navigation

![](.img/demo.gif)

A HTML-first single-player verse-in-a-repo:

* try the [ONLINE DEMO](https://coderofsalvation.github.io/aframe-verse/apps/)
* ❤️ serverless: no servers (NAF/signaling) needed
* ❤️ does not exit immersive-mode when navigating to different aframe experiences
* ❤️ easily teleport between aframe apps & aframe verses 
* ❤️ HTML-first: even runs on wordpress, no ninja javascript-skills needed

> Similar to a **WEB**ring, aframe-verse-component basically enables a **DOM**-ring and a **VERSE**-ring

## Example

```
<script src="aframe-verse-component"></script>

<a-scene>
  <a-entity aframe-verse="register: /aframe-verse.json">

    <!-- everything nested under `aframe-verse`, will be replaced upon navigation -->

    <a-box href="./app2.html"></a-box>
    <a-box href="https://somefriend.com/some_aframe_app.html"></a-box>
    <a-box href="https://somefriend.com/supercustom_webxr_app.html"></a-box>

  <a-entity>

  <!-- put 'global' entities here (UI, cursor or wearables e.g.)   -->
  <!-- to persist across navigation                                -->
  <!-- ps. multiple aframe-verse components are supported!         -->

</a-scene>
```

aframe-verse.json
```
{
  "schema":"aframe-verse/0.1",
  "destinations":[ 
    {"url":"./index.html"},                                      // change to absolute url for produciton 
    {"url":"https://somefriend.com/some_aframe_app.html"},       // allow in-app immersive navigation
    {
     "url":"https://somefriend.com/supercustom_webxr_app.html",  // a trusted app but which uses 
     "newtab": true                                              // a threejs e.g. (opens in new tab)
    }
  ], 
  "verses":["https://otherbefriendedverse.com/register.json"]
}
```

> click here for an [production-example of a aframe-verse.json](https://coderofsalvation.github.io/aframe-verse-leondustar/aframe-verse.json)

## Join us! Fork your own aframe-verse

* click the fork-button on this repository or [REMIX this glitch](https://glitch.com/edit/#!/remix/aframe-verse)
* rename the repository to `aframe-verse-*` (aframe-verse-myorganisation e.g.) for easy discoverability
* [github] go to settings-tab > enable github pages (use the main-branch)

your verse can now be accessed thru either:
* [github] `https://yourusername.github.io/aframe-verse-myorganisation/apps`
* [glitch] `https://aframe-verse-myorganisation.glitch.me/apps/` 

Developing:
* put your aframe apps in `apps/*`
* add `href`-attributes to clickable items (like a-box)
* whitelist the href-attributes by including them in `aframe-verse.json`
* use absolute href/urls (or use `./index.html` to guide the enduser back to the origin verse)

> Later: please connect your verse to this repo, by mentioning your json-URL in an issue. That way, future verses (forks) will automatically include your verse too.

## a federated monoverse

The following describes the thought-experiment of an aframe-verse:

> describe a XYZ-verse using the lowest common denominator between authors (=a git repository)

* the **gitrepo maintainer(s)** maintain a pool of trusted aframe apps (& components)
* the **gitrepo maintainer(s)** allow DOM-sharing (a DOM-ring) between eachothers aframe-apps
* the **gitrepo maintainer(s)** agree on shared garbage collection 

![](.img/flow.gif)

> Ideally, the maintainers need to approve new (website-specific) scripts/components, and include them in `index.html` when a new app arrives thru merge requests.

But..but..what about security?<br>
This is all up to the maintainers, just think of it as running a shared website.

## Scope

Out of the box, this monoverse-repo is good enough for seamlessly navigating between **simple read-only** aframe experiences (galleries, portfolios, vr movies, viewing scenes e.g.).<br>
A monoverse is the opposite of a 'metaverse'-concept (in which multiplayer-communication is fundamental).
For multiplayer, see the (way more complex) [NAF approach](https://github.com/networked-aframe) which requires you to run your own server.

## Extending navigation interactions

In the example, only touch/mouse-events are supported.<br>
By defining `hrefEvents`, you can trigger navigation for other events too:

```
<... aframe-verse="register: /yourverse.json; hrefEvents: click, mouseenter, collide, foobar">
   <a-box href="./show.html"/>  
</...>
```

> Profit! Now navigation is triggered to `show.html` whenever it is clicked, mousehovered or colliding with another object

calling `$('[aframe-verse] [href]').emit('foobar', {})` would trigger navigation too

## Customizing navigation

You can hook into navigation-events by creating a custom component:

```
// use like: <a-entity aframe-verse="..." navigate></a-entity>

AFRAME.registerComponent('navigate', {
  init: function(){
    console.log("initing navigation")
    this.el.addEventListener('beforeNavigate', this.beforeNavigate )
    this.el.addEventListener('navigate', this.navigate )
    this.el.addEventListener('registerJSON', this.registerJSON )
  }, 
  beforeNavigate(e){
    console.log("about to navigate to: "+e.detail.destination.url)
    // e.detail.destination = false           // uncomment to cancel navigation
  }, 
  navigate(e){
    console.log("navigating to: "+e.detail.destination.url)
  }, 
  registerJSON(e){
    let json = e.detail.json
    // example: skip non-immersive navigation links
    json.destinations = json.destinations.filter( (d) => d.newtab ? null : d )
    // example: launch external verses in a new tab (so its components get loaded too)
    json.destinations.map( (d) => d.url.match(/index\.html$/) ? d.newtab = true : null )
  }
})
```

## Connecting and Securing verses

![](.img/yodawg.jpg)

For navigation, you can add external verses to the `.verses`-array in `aframe-verse.json`, that's all!<br>
Optionally, you can secure the import-behaviour further using the `registerJSON`-event as shown above

## Fadetime & multi-verses

You can have multiple persisting verses at the same time.
Usecases for this are: a menu system, mini-games, inventory or a teleporting-maze e.g.:

```
<a-entity aframe-verse="register: aframe-verse.json">
  ...
</a-entity>

<a-entity aframe-verse="register: menu.json; fade: 0">   <!-- NOTE: superfast fade in ms (0=off) -->
  ...
</a-entity>

```

> NOTE: for heavy scenes you can set `fade: 4000` (4seconds fade) e.g.
