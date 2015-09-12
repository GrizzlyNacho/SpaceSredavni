# Space Sredavni
A reversal of a certain top-down alien shooter from an early stage of video games. 
This is a game created for the [JS13k](http://js13kgames.com/) 2015 Challenge. 

## How to play
This is a browser game. you could just pull down my code and run index.html. Alternatively you can grab just the archive which is what I actually submitted. 
The controls are very basic:
 - A and D to control the ship's movement
 - W to launch the ship
 - P to pause the game (any key to start and unpause)
 - R to restart the game once it has finished.

## Competition Rules
 - All of the code/assets/everything MUST be under 13k in size once archived. Tools like minification and uglifying are acceptable, but the repository with the 'clean' code should exist and be submitted as well.
 - No external libraries or services. Everything has to be from scratch. That means no JQuery, no CSS libraries, no anything. (aside: I don't think this is particularly limiting given how much is made available by the browser).
 - The game must be inspired by the theme word "Reversed". Interpret it how you will, but the judges will be based on how well they think you followed it.
 - Must be written within the month of the event (Aug 13 to Sept 13 2015)
 - Only new content.
 - Must work in at least one browser, but it's recommended to have it working in at least Firefox and Chrome.
 - No errors. The console should be barren and the game should actually work. 
 - Team size is arbitruary. Work with as many or as few people as you like. It won't affect the prize quantities awarded (if any).
 - You can submit more than one entry.
 - All entries will be tested manually.
 - No flash. This is meant to be js, html, and css.

## My Strat (or "Why is your code so odd?")
### The Concept
The theme for the game jam is Reversed, so I thought it would be neat to do something with playing the reverse of some familiar game. This is how I arrived at playing the other side of Space Invaders for Space Sredavni. In Space Invaders, you blow up ships as they worm their way down to the planet's surface. I thought it could be fun to actually place the ships in formation as the player. I'll let you judge if I succeeded.

### The Actual Code
Going into this, I knew 13k was going to be very small. As a result, I made several decisions from the start:

__1. Only have 1 js file.__
This probably was totally useless in keeping the size down, but did help for being constantly reminded of how large the code was getting. My usual method for programming demands modularization and this decision ended up causing some inner turmoil as I tried to keep the code clean without doing much boilerplate code. This is why I used some big box comments to separate different logical areas.

__2. Make everything Global.__
The approach for these things is just to hack something together, but even when I'm just cobbling a game together on the quick I don't like to forgo these kinds of conventions. I thought I was going to be so strapped for space I wouldn't want to have logical modules for my different defaults and game values. I tried to be cautious with naming and with where different variables were allowed to be used, but it still felt __wrong__ to be dumping everything out at global scope.

__3. No Assets. Just code.__
I decided that with space at a premium, I wouldn't put any assets in the game. I'm no artist and certainly no sound engineer, so I didn't think this would hurt me all that much and I think I was actually right about that. No proper game is without art though, so I knew I would need some kind of solution. To that end I made a little script that would parse a string and draw it out. Each character would be a pixel of some colour and then I could have a 16x16 sprite that I could draw at any size for just 256 characters. My plan was to further compress those 256 characters down if I needed to (I could make some shorthand for repeating characters and do some compression magic on the string), but that never ended up being necessary.
The first pass of this involved having each character representing a colour. I decided that I could get a lot more mileage out of the sprites if I made them as greyscales and did some hue multiplication magic to be able to draw the sprite in any colour without needing to specify anything more than the hue. I made some use of this, but all of my experimentation with rainbow ships felt too noisy, so I settled on red for failed spots, grey for pending spots, and a few shades of green for the player's ship.

## What I would do differently next time
I don't feel like throwing convention out the window did much for me in terms of space. Doing JS uglifying and minifying compresses the code down an incredible amount and my final submission is __well__ under the 13k maximum. I also think I would have picked a game concept that matched the theme word more apparently. While my game is a reversed version of space invaders in my eyes, it isn't always clear to the player.

The other thing I felt was lacking was how much time I put into this. The result does not feel like a game that was produced over a month. I picked and nibbled at the code over the course of the month and probably only spent around 10-15 hours of actual work into it. I still produced a game and wasn't rushed at the end, but I could have done so, so much more.
