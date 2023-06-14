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

---

By default, in nextJS 13 all components are server components. 
If you want to make it a client component, you have to use the "use client" directive, which is placed at the top of the file.

- the "error.tsx" (which is one of the special files) has to be a client component
- you can put right in the app folder (like loading, layout, page and not-found.tsx), but you could also give each route its own loading, layout, error,.. file for a granular approach
- to demonstrate the loading and error.tsx, i ve created the hello route which contains an artificial delay and a raised error 

----
If importing the bootstrap Container component, you will get an error, saying, that this client component needs to be marked with "use client". Because these components (like the Container) use client component features internally (like useState).

To get around this issue you could theoretically make the layout.tsx (where you want to use the Container) a client component with the "use client" directive at the top, but because server components are more efficient, there is another way:
- create src/components where you put all the components you share between the different pages
- inside create "bootstrap.tsx", make it a client component (remember: by default they are server components!) with "use client" and then export different components from the bootstrap library with the destructuring syntax:
```sh
export { Container, SSRProvider, Spinner, Alert } from 'react-bootstrap'
```

  (Note: SSRProvider is necessary for server side rendering)

- this way you re-export these Bootstrap components from bootstrap.tsx (your own client component) and then you can use them as client components. 
- finally you can change the import in layout.tsx from importing the Container from the newly created bootstrap.tsx instead of importing it from 'react-bootstrap' directly
 
**The most important concept** here is that the client component Container is now a wrapper for the "children", the pages which are server components. This is possible because the children are passed into the client component as props, meaning: the Container component has a Slot where it put the server component into and doesnt have to know in advance what it is.
- its especially important in the RootLayout in app/layout.tsx, because usually you have different kind of wrappers (like the Container or a ContextProvider eg) and you still want to be able to render server components inside the layout, and this is only possible by passing the server component as children props (children: React.ReactNode)
