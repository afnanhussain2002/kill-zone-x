import React, { useEffect, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { MapModel } from "./Map";
import { insertCoin, isHost, Joystick, myPlayer, onPlayerJoin, useMultiplayerState } from "playroomkit";
import CharacterController from "./CharacterController";
import Bullet from "./Bullet";

export const Experience = () => {
  const [players, setPlayers] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [networkBullets, setNetworkBullets] = useMultiplayerState("bullets",[]);

  const onFire = (bullet) => {
    console.log(bullet);
    setBullets((bullets) => [...bullets, bullet]);
  };
  const onHit = (bulletId) => {
    console.log("onHit", bulletId);
    setBullets((bullets) => bullets.filter((b) => b.id !== bulletId));
  };

  useEffect(() => {
    setNetworkBullets(bullets);
  },[bullets]);
  const start = async () => {
    await insertCoin();
  };

  useEffect(() => {
    start();

    onPlayerJoin((state) => {
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state !== state));
      });
    });
  }, []);
  return (
    <>
      <directionalLight
        position={[25, 18, -25]}
        intensity={0.3}
        castShadow
        shadow-camera-near={0}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      />
      <MapModel />
      {players.map(({ state, joystick }, idx) => (
        <CharacterController
          key={state.id}
          state={state}
          joystick={joystick}
          userPlayer={state.id === myPlayer()?.id}
          onFire={onFire}
        />
      ))}
       {(isHost() ? bullets : networkBullets).map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
