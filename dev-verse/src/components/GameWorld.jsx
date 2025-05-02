import { useEffect, useRef, useState } from "react";
import kaboom from "kaboom";
import townMap from "../assets/2dMap/tileSheet/tilesheet.png";
import greenShip from "../assets/spaceShip/green.png";
import banner from "../assets/ui/banner.png";
import ChatOverlay from "../components/ChatOverLay.jsx";
import laptop from "../assets/ui/laptop.PNG";
import VoiceChat from "./VoiceChatOverLay.jsx";
import musicBoard from "../assets/ui/musicBoard.png";
import MusicOverlay from "./MusicBoard.jsx";
import dictionaryPic from "../assets/ui/dictionary.png";
import  DictionaryOverlay from "./DictionaryOverlay.jsx";
//filename changed

export default function GameWorld() {
    const canvasRef = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
    const [isMusicOpen, setIsMusicOpen] = useState(false);

    const [isBookOpen, setIsBookOpen] = useState(false);

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

        k.loadSprite("laptop", laptop,);

        k.loadSprite("musicBoard", musicBoard,)

        k.loadSprite("dictionary", dictionaryPic)

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
                "path"
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(9 * tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90),
                "path"
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 22 }),
                k.pos(10 * tileSize, 4 * tileSize),
                k.z(2),
                k.rotate(90),
                "path"
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 1 }),
                k.pos(11 * tileSize, 5 * tileSize),
                k.z(2),
                k.rotate(180),
                "path"
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(10 * tileSize, 3 * tileSize),
                k.z(2),
                "path"
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 15 }),
                k.pos(12 * tileSize, 2 * tileSize),
                k.z(2),
                "path"
            ]);


            //Music studio walls
            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(9 * tileSize, 1 * tileSize),
                k.z(2),
                k.area(),
                k.body({ isStatic: true }),
                "wall",
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 3 }),
                k.pos(10 * tileSize, 1 * tileSize),
                k.z(2),
                k.area(),
                k.body({ isStatic: true }),
                "wall",
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(12 * tileSize, 1 * tileSize),
                k.z(2),
                k.area(),
                k.rotate(90),
                k.body({ isStatic: true }),
                "wall",
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 3 }),
                k.pos(9 * tileSize, 3 * tileSize),
                k.z(2),
                k.area(),
                k.rotate(-90),
                k.body({ isStatic: true }),
                "wall",
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(9 * tileSize, 4 * tileSize),
                k.z(2),
                k.area(),
                k.rotate(-90),
                k.body({ isStatic: true }),
                "wall",
            ]);

            
            k.add([
                k.sprite("tileSheet", { frame: 3 }),
                k.pos(12 * tileSize, 2 * tileSize),
                k.z(2),
                k.area(),
                k.rotate(90),
                k.body({ isStatic: true }),
                "wall",
            ]);

            k.add([
                k.sprite("tileSheet", { frame: 2 }),
                k.pos(12 * tileSize, 4 * tileSize),
                k.z(2),
                k.area(),
                k.rotate(180),
                k.body({ isStatic: true }),
                "wall",
            ]);

            // Banner (no collision)
            // k.add([
            //     k.sprite("banner"),
            //     k.pos(0, 0),
            //     k.z(1),
            //     k.scale(0.5),
            // ]);

            // k.add([
            //     k.text("Dev Verse", {
            //         size: 24,
            //         font: "sinko",
            //         color: 'black',
            //     }),
            //     k.pos(0.7, 0),
            //     k.z(2),
            // ]);

            // Player
            const player = k.add([
                k.sprite("greenShip"),
                k.pos(tileSize * 5, tileSize * 5), // Keep original starting position
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
                k.sprite("laptop"), // Thick black outline to give it that "scribble" look
                k.pos(2.95 * tileSize, 0.4 * tileSize),

                k.fixed(),
                k.scale(0.14),
                k.area(),
                k.z(10),
                k.opacity(0.95),
                "chatButton",
            ]);

            const dictionary = k.add([
                k.sprite("laptop"),
                k.pos(4.5 * tileSize, 0.4 * tileSize),
                k.fixed(),
                k.scale(0.14), // Flip horizontally
                k.area(),
                k.z(10),
                k.opacity(0.95),
                "dictionary",
            ]);


            const voiceButton = k.add([
                k.sprite("laptop"), // Thick black outline to give it that "scribble" look
                k.pos(5.95 * tileSize, 0.4 * tileSize),

                k.fixed(),
                k.scale(0.14),
                k.area(),
                k.z(10),
                k.opacity(0.95),
                "voiceButton",
            ]);

            const musicLayout = k.add([
                k.sprite("laptop"),
                k.fixed(),
                k.area(),
                k.pos(10 * tileSize, 2 * tileSize),
                k.scale(0.14),
                k.z(3),
                "musicBoard",
            ]
            )



            // Add chat icon or text to the button
            k.add([
                k.text("💬", {
                    size: 15,
                }),
                k.pos(3.35 * tileSize, 0.7 * tileSize),
                k.fixed(),
                k.z(11),
            ]);

            k.add([
                k.text("🔊", {
                    size: 15,
                }),
                k.pos(6.35 * tileSize, 0.7 * tileSize),
                k.fixed(),
                k.z(11),
            ]);

            k.add([
                k.text("🎶", {
                    size: 15,
                }),
                k.pos(10.3 * tileSize, 2.3 * tileSize),
                k.fixed(),
                k.z(11),
            ]);


            k.add([
                k.text("📚", {
                    size: 15,
                }),
                k.pos(4.9 * tileSize, 0.7 * tileSize),
                k.fixed(),
                k.z(11),
            ]);

            const instructionBox = k.add([
                k.rect(128, 150),               // Square background
                k.pos(0, 64),                // Position (adjust as needed)
                k.color(255, 255, 255),         // White background (optional)
                k.outline(4, k.rgb(0, 0, 0)),   // Black border
                k.z(5),                         // Z-index
            ]);
            
            const instructions = k.add([
                k.text(
                    "DevVerse Key Instruction\n" +
                    "M - open MusicVerse\n" +
                    "B - open BookVerse\n" +
                    "C - open ChatVerse\n" +
                    "V - open VoiceVerse",
                    {
                        size: 10,
                        width: 120,
                        align: "center",
                        lineSpacing: 6,
                    }
                ),
                k.pos(instructionBox.pos.x + 64, instructionBox.pos.y + 67), // Center inside the box
                k.anchor("center"),
                k.color(0, 0, 0), // Black text
                k.z(6),
            ]);


            // Make chat button clickable
            chatButton.onClick(() => {
                setIsChatOpen(true);  // Open chat overlay
            });


            voiceButton.onClick(() => {
                setIsVoiceChatOpen(true);  // Open voice chat overlay
            });

            musicLayout.onClick(() => {
                setIsMusicOpen(true);  // Open music overlay
            })

            dictionary.onClick(() => {
                setIsBookOpen(true);  // Open dictionary overlay
            })

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

            k.onKeyPress("v", () => {
                setIsVoiceChatOpen(true);
            });

            k.onKeyPress("c", () => {
                setIsChatOpen(true);
            });

            k.onKeyPress("m", () => {
                setIsMusicOpen(true);
            });

            // Dictionary shortcut key
            k.onKeyPress("d", () => {
                // This will trigger the dictionary through the Whiteboard component
                // The component handles its own open state
                document.getElementById('dictionary-button')?.click();
            });

            // k.onKeyPress("1",()=>{
            //     setIsVoiceChatOpen(false)
            // })


            player.onCollide("chatButton", () => {
                setIsChatOpen(true);  // Open chat overlay when colliding with chat button
            });

            player.onCollide("voiceButton", () => {
                setIsVoiceChatOpen(true);  // Open voice chat overlay when colliding with voice button
            }
            );

            player.onCollide("musicBoard", () => {
                setIsMusicOpen(true);  // Open music overlay when colliding with music board
            })

            player.onCollide("dictionary", () => {
                setIsBookOpen(true);  // Open dictionary overlay when colliding with dictionary button
            })
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
    }, [isChatOpen, isVoiceChatOpen, isMusicOpen,isBookOpen]); // Add dependencies to update when overlays open/close

    return (
        <div className="overflow-hidden m-0 p-0">
            <canvas ref={canvasRef} className="block w-full h-full" />
            
            {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
            {isVoiceChatOpen && <VoiceChat onClose={() => setIsVoiceChatOpen(false)} />}
            {isMusicOpen && <MusicOverlay onClose={() => setIsMusicOpen(false)} />}
            {isBookOpen && <DictionaryOverlay onClose={() => setIsBookOpen(false)} />}
        </div>
    );
}