import React from 'react';
import { AiOutlineHome, AiOutlineSetting} from 'react-icons/ai';
import {MdManageAccounts} from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import { BsPlusLg } from 'react-icons/bs';

import {CgProfile} from 'react-icons/cg';
import logo from './logo.png'
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';

export const SiteLogo = () => {
  return(
    <img 
      className="logo"
      src={logo}
      alt="logo"
    />
  )
}


export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'Home',
        ulr: '',
        icon: <AiOutlineHome />,
      },
    ],
  },
  {
    title: 'Users',
    links: [
      {
        name: 'Gerer users',
        url: 'users',
        icon: <FiUsers />,
      },
    ],
  },
  {
    title:'Categorie des Cours',
    links: [
      {
        name: 'Gerer les Categories',
        url: 'Categories',
        icon: <MdManageAccounts />,
      },
      {
        name: 'Nouveux Categories',
        url: 'NewCategorie',
        icon: <BsPlusLg />,
      }
    ]
  },
  {
    title: 'Cours',
    links: [
      {
        name: 'Gerer les Cours',
        url: 'Cours',
        icon: <MdManageAccounts />,
      },
      {
        name: 'Nouveux Cours',
        url: 'NewCours',
        icon: <BsPlusLg />,
      },
    ],
  },
  {
    title: 'Chapiters',
    links: [
      {
        name: 'Gerer les Chapiters',
        url: 'Chapiters',
        icon: <MdManageAccounts />,
      },
      {
        name: 'Nouveux Chapiter',
        url: 'NewChapiter',
        icon: <BsPlusLg />,
      },
    ],
  },
  {
    title: 'CodeLabs',
    links: [
      {
        name: 'Gerer les CodeLabs',
        url: 'Codelabs',
        icon: <MdManageAccounts />,
      },
      {
        name: 'Nouveux CodeLab',
        url: 'NewCodelab',
        icon: <BsPlusLg />,
      },
    ],
  },
];


export const userProfileData = [
  {
    icon: <CgProfile />,
    title: 'Mon Profile',
    desc: 'Voir le profile',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    to:"profile"
  },
  {
    icon: <AiOutlineSetting />,
    title: 'Settings',
    desc: 'Modifier les paramètres',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
    to:"settings"
  },
];

export const chatData = [
  {
    image:avatar3,
    message: 'An Error is Reported by Ali',
    desc: 'Ali reported an error at the introductin to kotlin codelab',
    time: '9:08 AM',
  },
  {
    image: avatar2,
    message: 'Maryam rated a codelab',
    desc: 'Maryam gives a 5 star to  the introduction to kotlin codelab',
    time: '11:56 AM',
  },
  {
    image:
      avatar4,
    message: 'An Error is Reported by Elon',
    desc: 'Elon reported an error at the adding a google map to a Flutter app codelab',
    time: '4:39 AM',
  },
  {
    image: avatar2,
    message: 'Maryam rated a codelab',
    desc: 'Maryam gives a 5 star to  the introduction to kotlin codelab',
    time: '11:56 AM',
  },
  {
    image:
      avatar4,
    message: 'An Error is Reported by Elon',
    desc: 'Elon reported an error at the adding a google map to a Flutter app codelab',
    time: '4:39 AM',
  },
];
