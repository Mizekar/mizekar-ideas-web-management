import React from 'react';
//import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Categories = React.lazy(() => import('./components/Categories/'));
const IdeaStatuses = React.lazy(() => import('./components/IdeaStatuses/'));
const Announcement = React.lazy(() => import('./components/Announcement/'));
const IdeaOptionSets = React.lazy(() => import('./components/IdeaOptionSets/'));
const RelationType = React.lazy(() => import('./components/RelationType/'));
const Ideas = React.lazy(() => import('./components/Ideas/'));
const Assessments = React.lazy(() => import('./components/Assessments/'));
const Profile = React.lazy(() => import('./components/Profile/'));


const routes = [
   /* {path: '/', exact: true, name: 'Home', component: DefaultLayout},*/
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/categories/:act?/:id?', name: 'Categories', component: Categories },
    {path: '/ideaStatuses/:act?/:id?', name: 'IdeaStatuses', component: IdeaStatuses },
    {path: '/announcement/:act?/:id?', name: 'Announcement', component: Announcement },
    {path: '/ideaOptionSets/:act?/:id?', name: 'IdeaOptionSets', component: IdeaOptionSets },
    {path: '/relationType/:act?/:id?', name: 'RelationType', component: RelationType },
    {path: '/ideas/:act?/:id?', name: 'Ideas', component: Ideas },
    {path: '/assessments/:act?/:id?', name: 'Assessments', component: Assessments },
    {path: '/profile', name: 'Profile', component: Profile },
];

export default routes;
