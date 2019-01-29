import React from 'react';
//import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Categories = React.lazy(() => import('./views/Categories/'));
const IdeaStatuses = React.lazy(() => import('./views/IdeaStatuses/'));
const Announcement = React.lazy(() => import('./views/Announcement/'));
const IdeaOptionSets = React.lazy(() => import('./views/IdeaOptionSets/'));


const routes = [
   /* {path: '/', exact: true, name: 'Home', component: DefaultLayout},*/
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/categories/:act?/:id?', name: 'Categories', component: Categories },
    {path: '/ideaStatuses/:act?/:id?', name: 'IdeaStatuses', component: IdeaStatuses },
    {path: '/announcement/:act?/:id?', name: 'Announcement', component: Announcement },
    {path: '/ideaOptionSets/:act?/:id?', name: 'IdeaOptionSets', component: IdeaOptionSets },
];

export default routes;
