## deadsimple immersive navigation

![](.img/demo.gif)

A singleplayer-verse-in-a-repo:

* serverless: no servers (NAF/signaling) needed
* don't exit immersive mode when navigating to different aframe experience 
* teleporting between aframe apps & aframe verses 

> Similar to a **WEB**ring, aframe-verse-component basically enables a **DOM**-ring and a **VERSE**-ring

## Example

```
<script src="aframe-verse-component"></script>

<a-scene>
  <a-entity aframe-verse="register: /yourregister.json">

    <!-- your aframe app goes here..and will be replaced upon navigation -->

    <a-box href="./app2.html"></a-box>
    <a-box href="https://somefriend.com/some_aframe_app.html"></a-box>
    <a-box href="https://somefriend.com/supercustom_webxr_app.html"></a-box>

  <a-entity>
</a-scene>
```

yourregister.json
```
{
  "schema":"aframe-verse/0.1",
  "destinations":[ 
    {"url":"./index.html"},
    {"url":"somefriend.com/some_aframe_app.html"},         // allow in-app immersive navigation
    {
     "url":"somefriend.com/supercustom_webxr_app.html",    // a trusted app but which uses 
     "owntab": true                         
    }
  ], 
  "verses":["https://otherbefriendedverse.com/register.json"]
}
```

## a federated monoverse

The following describes the thought-experiment of aframe-verse-component:

> describe a XYZ-verse using the lowest common denominator between authors (=a git repository)

* the **repository maintainer(s)** maintain a (monorepo) pool of aframe apps 
* the **repository maintainer(s)** allows DOM-sharing (a DOM-ring) between eachothers aframe-apps
* the **repository maintainer(s)** maintain a pool of (trusted) shared aframe components
* the **repository maintainer(s)** agree on shared garbage collection 

![](.img/flow.gif)

> Ideally, the maintainers need to approve new (website-specific) scripts/components when a new app arrives thru merge requests.

But..but..what about security?<br>
This is all up to the maintainers, just think of it as running a shared website.

## Scope

Out of the box, this monoverse-repo is good enough for seamlessly navigating between **simple read-only** aframe experiences (galleries, portfolios, vr movies, viewing scenes e.g.).<br>
A monoverse is the opposite of a 'metaverse'-concept (in which multiplayer-communication is fundamental).
For multiplayer, see the (way more complex) [NAF approach](https://github.com/networked-aframe) which requires you to run your own server.

