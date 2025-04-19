import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import townMap from "../assets/2dMap/tileSheet/tileSheet.png";
export default function GameWorld() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const k = kaboom({
            width: window.innerWidth,
            height: window.innerHeight,
            scale: 2,
            canvas: canvasRef.current,
            background: [0, 0, 0], 
        });

        k.loadSprite("tileSheet", townMap, {
            sliceX: 14,
            sliceY: 11,
            tileWidth: 64,
            tileHeight: 64,
        })

        k.onLoad(() => {
            const tileSize = 64;
            const cols = Math.ceil(window.innerWidth / tileSize);
            const rows = Math.ceil(window.innerHeight / tileSize);

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    k.add([
                        k.sprite("tileSheet", { frame: 0 }), 
                        k.pos(x * tileSize, y * tileSize),
                        k.z(-10),
                    ]);
                }
            }
        })







        return () => {
            // Kaboom doesn't support clean teardown yet — refresh page to reset
        };
    }, []);

    return (
        <div className="overflow-hidden m-0 p-0">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}