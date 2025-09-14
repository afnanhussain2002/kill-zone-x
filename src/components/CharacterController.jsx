import React, { useRef, useState } from "react";
import { CharacterSoldier } from "./CharacterSoldier";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { isHost } from "playroomkit";
import { CameraControls } from "@react-three/drei";

const MOVEMENT_SPEED = 200;
const FIRE_RATE = 300;
const CharacterController = ({ state, joystick, userPlayer, onFire, ...props }) => {
  const groupChar = useRef();
  const character = useRef();
  const charRigidBody = useRef();
  const controls = useRef();
  const lastShoot = useRef(0)
  const [animation, setAnimation] = useState("Idle");

  useFrame((_, delta) => {
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(charRigidBody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 2 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    const angle = joystick.angle();
    if (joystick.isJoystickPressed() && angle) {
      setAnimation("Run");
      character.current.rotation.y = angle;

      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };
      charRigidBody.current.applyImpulse(impulse, true);
    } else {
      setAnimation("Idle");
    }

    if (isHost()) {
      state.setState("pos", charRigidBody.current.translation());
    } else {
      const pos = state.getState("pos");
      if (pos) {
        charRigidBody.current.setTranslation(pos);
      }
    }

    // check if the fire button pressed

    if (joystick.isPressed("fire")) {
      setAnimation("Idle_Shoot")
      if (isHost()) {
        if (Date.now() - lastShoot.current > FIRE_RATE) {
          lastShoot.current = Date.now()
          
          const newBullet = {
            id: state.id + "-" + +new Date(),
            position:vec3(charRigidBody.current.translation()),
            angle,
            player: state.id
          }
          onFire(newBullet)
        }
      }
    }
  });
  return (
    <group ref={groupChar} {...props}>
      {userPlayer && <CameraControls ref={controls} />}
      <RigidBody
        ref={charRigidBody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type={isHost() ? "dynamic" : "kinematicPosition"}
      >
        <group ref={character}>
          <CharacterSoldier
            color={state.state.profile?.color}
            animation={animation}
          />
        </group>

        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.8, 0]} />
      </RigidBody>
    </group>
  );
};

export default CharacterController;
