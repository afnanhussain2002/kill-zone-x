import { RigidBody } from '@react-three/rapier'
import React from 'react'
import { MeshBasicMaterial } from 'three'

const bulletMaterial = new MeshBasicMaterial({
    color:"hotpink",
    toneMapped:false
})

bulletMaterial.color.multiplyScalar(42)

const Bullet = ({player, angle, position, onHit}) => {
  return (
    <group position={[position.x, position.y, position.z]} rotation-y={angle}>
        <RigidBody>
            <mesh position-z={0.25} material={bulletMaterial} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.5]}/>
            </mesh>
        </RigidBody>

    </group>
  )
}

export default Bullet