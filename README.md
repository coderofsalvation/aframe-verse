## AFRAME-verse, deadsimple immersive navigation

![](.img/demo.gif)

A HTML-first-single-player-verse:

* try the [ONLINE DEMO](https://coderofsalvation.github.io/aframe-verse/apps/)
* ❤️ serverless: no servers (NAF/signaling) needed
* ❤️ easily teleport between aframe apps & aframe verses 
* ❤️ does not exit immersive-mode when navigating to different aframe experiences
* ❤️ HTML-first: even runs from wordpress, no ninja javascript-skills needed
* ❤️ #decentralized #noblockchain #permissionless-first #federatedpullrequests

> Similar to a **WEB**ring, aframe-verse-component basically enables a **DOM**-ring and a **VERSE**-ring

<details>
  <summary><h1>Usage</h2></summary>
  <br>

```
<script src="aframe-verse-component"></script>

<a-scene>
  <a-entity aframe-verse="register: /aframe-verse.json">

    <!-- everything nested under `aframe-verse`, will be replaced upon navigation  -->

    <a-box href="/"></a-box>            <!-- goes home (index.html) / the verse of entry --> 
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

</details>

<details>
  <summary><h1>How it works</h2></summary>
  <br>

![](.img/flow.jpg)

A visitor in the **aframe-verse** just teleports to other destinations and clusters ("*beam me up scotty!*").<br>

>  When a visitor surfs to a cluster-client (`index.html`), it loads all components, which other linked experiences use. Other trusted components can be loaded by exception.<br>

<details>
  <summary>How does this works in large?</summary>
  <br>
  The concept above is an answer to the fact that each tile-based 'metaverse' will always turn into some kind of **hypercentralized** client-project.
  Instead, an user in the **aframe-verse** just teleports to other destinations and clusters ("*beam me up scotty!*").<br>
  When the enduser surfs to a cluster-client (`index.html`), it basically loads all components, which other linked experiences use.<br>
  This is a security-limitation and a performance-feature, because this: 
  
  * makes traveling between experiences (within a cluster) very fluid and fast.
  * it creates a decentralized incentive between developer(s) to:
    * collaborate on a seamless & secure end-user experiences-cluster
    * consistent UX because of:
      * shared components
      * shared global objects: wearables, UI, AR/VR controller-support e.g.
  
  Exceptions to this rule can be agreed upon by the developer(s) of a cluster.<br>
  By allowing on-the-fly components by certain developers or CDN's:
  
  `{"url":"https://runvnc.net/trustedpexperience", "scripts":true }`
  
  Worstcase, a destination can be loaded in a new tab (`newtab:true` which exits immersive navigation ), which then basically becomes the new cluster.
  
</details>

</details>

<details>
  <summary><h1>Publish,  selfhost & connect your verse (for free)</h2></summary>
  <br>

3 ways of hosting:

<details>
  <summary><h3>GITHUB / GITLAB</h2></summary>
  <br>

* click the fork-button on [github](https://github.com/coderofsalvation/aframe-verse) or [gitlab](https://gitlab.com/coderofsalvation/aframe-verse)
* rename the repository to `aframe-verse-*` (aframe-verse-myorganisation e.g.) for easy discoverability
* github: go to settings-tab > enable github pages (use the main-branch)
* profit! your verse can now be accessed thru 
  * github: `https://yourusername.github.io/aframe-verse-myorganisation/apps`
  * gitlab: `https://yourusername.gitlab.io/aframe-verse-myorganisation/apps`
</details>

<details>
  <summary><h3>GLITCH</h2></summary>
  <br>
**GLITCH (free)**
* [REMIX this glitch](https://glitch.com/edit/#!/remix/aframe-verse)
* rename the project to `aframe-verse-*` (aframe-verse-myorganisation e.g.) for easy discoverability
* your verse can now be accessed thru `https://aframe-verse-myorganisation.glitch.me/apps/` 
</details>
 
<details>
  <summary><h3>SELFHOSTING (redbean/wordpress/apache e.g.)</h2></summary>
  <br>
**SELFHOSTING**
* [download zip](https://github.com/coderofsalvation/aframe-verse/archive/refs/heads/main.zip) and unpack it in your apache/worpress dir e.g.
</details>

Developing:
* put your aframe apps in `apps/*`
* add `href`-attributes to clickable items (like a-box)
* whitelist the href-attributes by including them in `aframe-verse.json`
* use absolute href/urls (or use `./index.html` to guide the enduser back to the origin verse)

> Later: please connect your verse to this repo, by mentioning your json-URL in an issue. That way, future verses (forks) will automatically include your verse too.

</details>

## A federated HTML-first verse

> aframe-verse describes a verse using the lowest common denominator between Aframe authors (=a webdirectory)

* the **maintainer(s)** maintain a pool of trusted aframe apps (& components)
* the **maintainer(s)** allow DOM-sharing (a DOM-ring) between eachothers aframe-apps
* the **maintainer(s)** agree on shared garbage collection 

> Ideally, the maintainers need to approve new (website-specific) scripts/components, and include them in `index.html` when a new app arrives thru merge requests.

But..but..what about privacy & security?<br>
This is all up to the maintainers of a verse, just think of it as running a shared website & linksharing.
For more info [read this](https://github.com/coderofsalvation/aframe-verse/issues/1)

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
    // e.detail.destination = false           // uncomment to cancel navigation 
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

## Scope

Out of the box, this monoverse-repo is good enough for seamlessly navigating between **simple read-only** aframe experiences (galleries, portfolios, vr movies, viewing scenes e.g.).<br>
A monoverse is the opposite of a 'metaverse'-concept (in which multiplayer-communication is fundamental).
Therefore, the following is out of scope, but can still be used to progressively enhance an `aframe-verse`:

* multiplayer: see the (way more complex) [NAF approach](https://github.com/networked-aframe) which requires you to run your own server.
* hardened security/privacy: introduce activitypub-layer, p2p webrtc like yjs
