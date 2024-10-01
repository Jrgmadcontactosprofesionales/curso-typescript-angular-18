import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page/home-page.component';
//import { BooksPageComponent } from './pages/books-page/books-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
    },
    {
        path: 'books',
        // Mejora en performance: el código de este componente ya no se incluye en el main.js sino en un fichero JS aparte (chunk)
        loadComponent: () => import('./pages/books-page/books-page.component').then((module) => module.BooksPageComponent),
        //component: BooksPageComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
