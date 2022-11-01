## deadsimple immersive navigation

![](demo.gif)

A singleplayer-verse-in-a-repo:

* serverless: no servers (NAF/signaling) needed
* don't exit immersive mode when navigation elsewhere 

## Example

```
<script src="aframe-verse-component"></script>

<a-scene>
  <a-entity aframe-verse="register: /yourregister.json">

    <!-- your aframe app goes here -->

    <a-box href="somefriend.com/otherapp.html"></a-box>

  <a-entity>
</a-scene>
```

yourregister.json
```
{
  "schema":"aframe-verse/0.1",
  "destinations":[ 
    {"url":"./index.html"},
    {"url":"./app2.html"}, 
    {"url":"fabien.benetou.fr/pub/home/future_of_text_demo/engine/",
     "protocol":"https://", 
     "author":"Fabien Benetou", 
     "owntab": true
    }
  ], 
  "verses":["https://otherbefriendedverse.com/register.json"]
}
```

## a federated monoverse

This is basically the thought-experiment of aframe-verse-component:

* describe a XYZ-verse using the lowest common denominator between authors (=a repository)
* the authors trust DOM-sharing (a DOM-ring) between eachothers aframe-apps
* the authors maintain a pool of (trusted) shared aframe components
* consist of websites which use those components

> Ideally, a verse-member needs to approve new (website-specific) components whenever a aframe website-author wants to add a new aframe site.

But..but..what about security?<br>
This is all up to the maintainers, just think of it as running a shared website.

## Scope

This monoverse is perfectly enough for seamlessly navigating between **simple** aframe experiences (galleries, viewing scenes).
It's basically the opposite of a 'metaverse'-concept (in which multiplayer-communication is fundamental).
For multiplayer, see the (way more complex) [NAF approach](https://github.com/networked-aframe) which requires you to run your own server.
