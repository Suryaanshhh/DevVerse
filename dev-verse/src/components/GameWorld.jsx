import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import townMap from "../assets/2dMap/tileSheet/tilesheet.png";
import greenShip from "../assets/spaceShip/green.png";
import banner from "../assets/ui/banner.png";
export default function GameWorld() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Initialize Kaboom with the canvas reference
        const k = kaboom({
            width: window.innerWidth,
            height: window.innerHeight,
            scale: 2,
            canvas: canvasRef.current,
            background: [0, 0, 0],
        });

        // Loading map and ship sprites
        k.loadSprite("tileSheet", townMap, {
            sliceX: 14,
            sliceY: 11,
            
        });

        // Loading ship sprites
        k.loadSprite("greenShip", greenShip, {
            tileWidth: 10,
            tileHeight: 10,
        });

        k.loadSprite("banner", banner)


        const tileSize = 64;
        
        // Create our game scene
        k.scene("game", () => {
            const cols = Math.ceil(window.innerWidth / tileSize);
            const rows = Math.ceil(window.innerHeight / tileSize);

            // Generate background tiles
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    k.add([
                        k.sprite("tileSheet", { frame: 7 }),
                        k.pos(x * tileSize, y * tileSize),
                        k.z(-10),
                    ]);
                }
            }


            // Create walls using the tile sheet

            for(let i=3;i<7;i++){
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(i * tileSize, 0 * tileSize),
                    k.z(2)
                ])
               }

            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(2 * tileSize, 0 * tileSize),
                k.z(2)
            ])



            for(let i=2;i<5;i++){
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(  2* tileSize, i * tileSize),
                    k.z(2),
                    k.rotate(-90)
                ])
            }

            k.add([
                k.sprite("tileSheet", { frame: 3 }),
                k.pos(  2* tileSize, 6 * tileSize),
                k.z(2),
                k.rotate(-90)
            ])
           
            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(8 * tileSize, 0 * tileSize),
                k.z(2),
                k.rotate(90)
            ])



            for (let i=1;i<4;i++){
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(  8* tileSize, i * tileSize),
                    k.z(2),
                    k.rotate(90)
                    
                ])
    
            }

            k.add([
                k.sprite("tileSheet", { frame: 36 }),
                k.pos(  7* tileSize, 4 * tileSize),
                k.z(2),
                
            ])

            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(  9* tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90)
                
            ])
            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(  10* tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90)
                
            ])

            k.add([
                k.sprite("tileSheet", { frame: 1 }),
                k.pos(  11* tileSize, 5 * tileSize),
                k.z(2),
                k.rotate(180)
                
            ])
            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(  10* tileSize, 3 * tileSize),
                k.z(2),  
            ])
       
            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(  10* tileSize, 2 * tileSize),
                k.z(2),  
            ])
            
            //Banner 
            k.add([
                k.sprite("banner"),
                k.pos(0, 0),
                k.z(1),
                k.scale(0.5)
            ])

            k.add([
                k.text("Dev Verse",{
                    size: 24,
                    font: "sinko",
                    color: 'black',
                }),
                k.pos(0.7, 0),
                k.z(2),
            ])
              
            
            // Create player ship with controls
            const player = k.add([
                k.sprite("greenShip"),
                k.pos(tileSize * 2, tileSize * 2), // Start a bit away from the wall
                k.area(),
                k.body(),
                k.scale(0.3),
                k.z(2.5),
                "player",
                {
                    speed: 200,
                }
            ]);

            // Add controls
            k.onKeyDown("left", () => {
                player.move(-player.speed, 0);
            });

            k.onKeyDown("right", () => {
                player.move(player.speed, 0);
            });

            k.onKeyDown("up", () => {
                player.move(0, -player.speed);
            });

            k.onKeyDown("down", () => {
                player.move(0, player.speed);
            });

            // Alternative WASD controls
            k.onKeyDown("a", () => {
                player.move(-player.speed, 0);
            });

            k.onKeyDown("d", () => {
                player.move(player.speed, 0);
            });

            k.onKeyDown("w", () => {
                player.move(0, -player.speed);
            });

            k.onKeyDown("s", () => {
                player.move(0, player.speed);
            });

            // Check for collisions with walls
            player.onCollide("banner", () => {
                // Push the player away from the wall
                console.log("Collided with wall!");
            });

            // Add game boundaries
        //     player.onUpdate(() => {
        //         // Keep player within horizontal bounds
        //         if (player.pos.x < tileSize) {
        //             player.pos.x = tileSize;
        //         }
                
        //         if (player.pos.x > k.width() - 40) {
        //             player.pos.x = k.width() - 40;
        //         }
                
        //         // Keep player within vertical bounds
        //         if (player.pos.y < 0) {
        //             player.pos.y = 0;
        //         }
                
        //         if (player.pos.y > k.height() - 40) {
        //             player.pos.y = k.height() - 40;
        //         }
        //     });
        });

        // Start the game
        k.onLoad(() => {
            k.go("game");
        });

        return () => {
            // Cleanup function
        };
    }, []);

    return (
        <div className="overflow-hidden m-0 p-0">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}