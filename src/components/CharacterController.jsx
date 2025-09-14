import React, { useRef, useState } from 'react'
import { CharacterSoldier } from './CharacterSoldier';

const CharacterController = ({
    state,
    joystick,
    userPlayer,
    ...props
}) => {
    const group = useRef();
    const character = useRef();
    const [animation, setAnimation] = useState("Idle");
  return (
    <grope ref={group}>
        <group ref={character}>
        <CharacterSoldier 
        color={state.state.profile?.color}
        animation={animation}
        
        
        />
        </group>

    </grope>
  )
}

export default CharacterController