<html>
 └── <body>
      └── <div class="app">  ← main container

          ├── <header>
          │     ├── <h1>Bubble Pop</h1>
          │     └── 2 buttons: Help, Reset

          ├── <div class="controls">
          │     ├── Start button
          │     ├── Pause button
          │     ├── Mode dropdown (Color / Alphabet / Both)
          │     ├── Checkbox: Show letters
          │
          ├── <div class="canvas-wrap">
          │     └── <canvas id="gameCanvas">  ← entire game drawn here

          ├── <div class="ui-row">
          │     ├── Speed range slider
          │     ├── Bubble count slider
          │     └── Target select dropdown

          ├── <div class="hud">
          │     ├── Target display
          │     ├── Score
          │     ├── Misses
          │     └── Remaining

          └── <div class="status">Status messages</div>

          + JS script below (game logic)
