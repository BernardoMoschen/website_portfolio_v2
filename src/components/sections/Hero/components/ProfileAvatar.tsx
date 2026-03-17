import React from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
  profileImage: string;
  name: string;
  size?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profileImage,
  name,
  size = 140,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        padding: 3,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        boxShadow: '0 0 40px rgba(127, 176, 105, 0.25), 0 0 80px rgba(127, 176, 105, 0.1)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-bg-glass, #111)',
        }}
      >
        <Image
          src={profileImage}
          alt={`${name} — Full Stack Engineer`}
          width={size}
          height={size}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
