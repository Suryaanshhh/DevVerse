import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";
import townMap from "../assets/2dMap/tileSheet/tilesheet.png";
import greenShip from "../assets/spaceShip/green.png";
import banner from "../assets/ui/banner.png";
import ChatOverlay from "../components/ChatOverLay.jsx";

export default function GameWorld() {
    const canvasRef = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const k = kaboom({
            width: window.innerWidth,
            height: window.innerHeight,
            scale: 2,
            canvas: canvasRef.current,
            background: [0, 0, 0],
            global: false
        });

        // Load sprites
        k.loadSprite("tileSheet", townMap, {
            sliceX: 14,
            sliceY: 11,
        });

        k.loadSprite("greenShip", greenShip, {
            tileWidth: 10,
            tileHeight: 10,
        });

        k.loadSprite("banner", banner);
        
        // Load chat icon sprite - you'll need to add this to your assets
        // Or you can create a simple text sprite as shown below
        
        const tileSize = 64;

        k.scene("game", () => {
            const cols = Math.ceil(window.innerWidth / tileSize);
            const rows = Math.ceil(window.innerHeight / tileSize);

            // Background tiles (no collisions)
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    k.add([
                        k.sprite("tileSheet", { frame: 7 }),
                        k.pos(x * tileSize, y * tileSize),
                        k.z(-10),
                    ]);
                }
            }

            // Horizontal top wall
            for (let i = 3; i < 7; i++) {
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(i * tileSize, 0 * tileSize),
                    k.z(2),
                    k.area(),
                    k.body({ isStatic: true }),
                    "wall",
                ]);
            }

            // Top left corner wall
            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(2 * tileSize, 0 * tileSize),
                k.z(2),
                k.area(),
                k.body({ isStatic: true }),
                "wall",
            ]);

            // Left vertical walls
            for (let i = 2; i < 5; i++) {
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(2 * tileSize, i * tileSize),
                    k.z(2),
                    k.rotate(-90),
                    k.area(),
                    k.body({ isStatic: true }),
                    "wall",
                ]);
            }

            k.add([
                k.sprite("tileSheet", { frame: 3 }),
                k.pos(2 * tileSize, 6 * tileSize),
                k.z(2),
                k.rotate(-90),
                k.area(),
                k.body({ isStatic: true }),
                "wall",
            ]);

            // Top right corner wall
            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(8 * tileSize, 0 * tileSize),
                k.z(2),
                k.rotate(90),
                k.area(),
                k.body({ isStatic: true }),
                "wall",
            ]);

            // Right vertical walls
            for (let i = 1; i < 4; i++) {
                k.add([
                    k.sprite("tileSheet", { frame: 3 }),
                    k.pos(8 * tileSize, i * tileSize),
                    k.z(2),
                    k.rotate(90),
                    k.area(),
                    k.body({ isStatic: true }),
                    "wall",
                ]);
            }

            // Other decorative tiles (with or without collision based on needs)
            k.add([
                k.sprite("tileSheet", { frame: 36 }),
                k.pos(7 * tileSize, 4 * tileSize),
                k.z(2),
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(9 * tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90),
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(10 * tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90),
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 1 }),
                k.pos(11 * tileSize, 5 * tileSize),
                k.z(2),
                k.rotate(180),
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(10 * tileSize, 3 * tileSize),
                k.z(2),
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(10 * tileSize, 2 * tileSize),
                k.z(2),
            ]);

            // Banner (no collision)
            k.add([
                k.sprite("banner"),
                k.pos(0, 0),
                k.z(1),
                k.scale(0.5),
            ]);

            k.add([
                k.text("Dev Verse", {
                    size: 24,
                    font: "sinko",
                    color: 'black',
                }),
                k.pos(0.7, 0),
                k.z(2),
            ]);

            // Player
            const player = k.add([
                k.sprite("greenShip"),
                k.pos(tileSize * 2, tileSize * 2), // Keep original starting position
                k.area(),
                k.body(),
                k.scale(0.3),
                k.z(2),
                "player",
                {
                    speed: 200,
                },
            ]);

            // Add chat button as a sprite
            const chatButton = k.add([
                k.rect(64, 35, { radius: 4 }), // Slightly rounded rectangle for a hand-drawn feel
                k.color(255, 255, 255), // White background
                k.outline(3, k.rgb(0, 0, 0)), // Thick black outline to give it that "scribble" look
                k.pos(3*tileSize, 0.5*tileSize), 
                k.fixed(),
                k.area(),
                k.z(10),
                k.opacity(0.95),
                "chatButton",
            ]);
            
            // Add chat icon or text to the button
            k.add([
                k.text("💬", {
                    size: 14,
                }),
                k.pos(3*tileSize, 0.5*tileSize), 
                k.fixed(),
                k.z(11),
            ]);
            
            // Make chat button clickable
            chatButton.onClick(() => {
                setIsChatOpen(true);  // Open chat overlay
            });

            // Movement controls
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

            // Chat shortcut key
            k.onKeyPress("c", () => {
                setIsChatOpen(true);
            });

            player.onCollide("chatButton", () => {
                setIsChatOpen(true);  // Open chat overlay when colliding with chat button
            });

            // Optional collision log
            player.onCollide("wall", () => {
                console.log("Bumped into wall!");
            });
        });

        k.onLoad(() => {
            k.go("game");
        });

        return () => {
            // Cleanup if needed
        };
    }, [isChatOpen]); // Add isChatOpen as dependency to update when chat opens/closes

    return (
        <div className="overflow-hidden m-0 p-0">
            <canvas ref={canvasRef} className="block w-full h-full" />
            {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
        </div>
    );
}