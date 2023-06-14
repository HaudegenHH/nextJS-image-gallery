# NextJS 13.4
 
Demonstrating all important features and caching strategies of the new Next.js app router.\
**Including the topics**:

- the new routing system with file structure and special files (loading.tsx, error.tsx, not-found.tsx, layout.tsx, route.tsx, and page.tsx)
- static rendering, dynamic rendering, and incremental static regeneration
- setting up API route handlers (GET, POST, etc.) and how to use NextRequest and NextResponse in the backend
- how to make component libraries like Bootstrap work with server components
- and finally how to deploy the project to Vercel

## Start

- visit the nextJS site
  https://nextjs.org/docs

- make sure you have at least node 16.8 installed
- installing nextJS (the latest version)
```sh
npx create-next-app@latest
```

project name: nextjs-13.4-image-gallery\
typescript - yes\
ESLint - yes\
TailwindCSS - no\
src directory - yes\
app router - yes\
change import alias default: @/* - no  


### Install bootstrap instead of tailwindCSS
```sh
npm i bootstrap react-bootstrap
```

- starting the development server
```sh
npm run dev
```

- to use bootstrap: 
in src/app/layout.tsx above the globals.css add the import for bootstrap:
    
    import 'bootstrap/dist/css/bootstrap.min.css';
