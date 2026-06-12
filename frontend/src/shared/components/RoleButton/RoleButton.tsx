'use client';

import { ReactElement } from 'react';
import styles from './RoleButton.module.scss';
import Image from 'next/image';

interface RoleButtonProps {
  roleId: string;
  roleName: string;
  buttonName: string;
  onAdd: (roleId: string) => void;
}

export default function RoleButton(props: RoleButtonProps): ReactElement {
  const { roleId, roleName, buttonName, onAdd } = props;

  return (
    <button className={styles['role-button']} onClick={() => onAdd(roleId)}>
      <Image
        className={styles['role-button__image']}
        src="/images/plus-circle.svg"
        alt="plus"
        height={156}
        width={156}
      />
      <div className={styles['role-button__details']}>
        <p className={styles['role-button__role']}>{roleName}</p>
        <p className={styles['role-button__role']}>{buttonName}</p>
      </div>
    </button>
  );
}
