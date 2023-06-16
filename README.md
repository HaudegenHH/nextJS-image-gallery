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

---

The SSRProvider: import from your own components folder (@/components/bootstrap)

Again: importing this component directly from the bootstrap library wont work!

Wrapping the Container with the SSRProvider is necessary for react-bootstrap whenever you use server side rendering - so just wrap your entire layout with it as specified by the react-bootstrap documentation.

You can wrap the whole Container in another (native html) Tag like a semantic div (eg: main-tag) in order to separated the main content from the NavBar which you put above the main tag.

---

## more helpful presets

- in the predefined globals.css give the body a min-height of 100vh to stretch the existing gradient to the whole page (if you want to keep the gradient)
- another thing you could setup in advance in the globals.css: 
Give the img-Tag a background-color of for example lightblue. That way if you load an image you could use it as a kind of placeholder.
- the loading.tsx gets a spinner, and again: import it from your components folder, so that you dont have to make the loading page a client component.

- next step is setting up the navbar with Links from "next/link", the new "next/navigation" useRouter, usePathname, useSearchParams,.. hooks combined with react-bootstrap components like Nav and Navbar, so that you (eg) can use a Navbar.Brand as a link as specified in the react-bootstrap documentation. 
<Navbar.Brand as={Link}>
- if you would use just Navbar.Brand with an href to "/", it would cause every time a hard refresh and you would lose the state and caching, because under the hood its an a-tag
- to get around you could use as well Navbar.Brand which wraps a Link Tag (from next/link) with a href or instead of nesting the Link component you jst add  as={Link} to Navbar.Brand which react-bootstrap conviniently provides
- nice about Bootstrap is, that you get a collapsable Navbar ( with the expand attribute set to "sm") out of the box which is totally responsive, meaing: when the screen gets sm (small) the menu turns into a hamburger menu. (Navbar.Toggle where you define the aria-controls/burger button which corresponds to the id for the Navbar.Collapse)
- note: to avoid name conflicts with the Navbar from react-bootstrap, you could use pascal case for the NavBar.
- because i use hooks in this NavBar.tsx component, i declare it as a client component with "use client" directive. therefore you could import the Navbar either from the @/components/bootstrap or directly, since this is a client component anyway
- the Nav.Link component has an addional attribute "active" which indicates that a user is on this specific page. For that you would use the usePathname hook from next/navigation 

---

## different caching strategies

- after setting up the NavBar i ll now start creating some pages with different caching strategies
- if you look into the hello/page.tsx where you have an delay of 1 second: by default in a server component like this, then the code will run when you compile the project
- so if you would for example fetch any data in this async function and it would be put into the layout, then nextJS would automatically cache this generated layout on the server, and it will serve the exact same page to the users until you compile the project again. 
- if you are on the hello page, and you see the loading spinner, because of the time-out of 1sec; but its something different if you run it unlike before in development mode with npm run dev, but instead building the project (for production) beforehand with:
```sh
npm run build
```
...and during this building process nextJS will optimize the code for production and generate static pages for server components.
- when the build is ready you type:
```sh
npm run start 
```

..which starts the project in production mode

Again: When you compile the project, the server component like hello/page.tsx was executed and then a static html page was generated.
When you now refresh this page, you dont see the loading spinner ever more, instead you get the static page immediately.

---

## fetching (real) data from 
https://api.unsplash.com/photos

- first signup on
https://unsplash.com/developers

...with a free tier, whcih allows you to fetch 50 images per hour

- register with Username & Password or via Facebook
- create an application (requires a name and a description)
- scroll down to access and secret key, copy to clipboard 
- create a .env.local in the root folder; in nextjs you use the normal .env 
  for common configuration and you put your secrets into the .env.local, thats why 
  .env.local is in the .gitignore by default (you could surround the access and secret key by quotation marks but its not necessary)

## type safety
- if you look into the api section on unsplash.com and choose the get-random-photo endpoint, you see as well the JSON Response that you will get back from this api
- and since i ve choosen to write this project in typescript, i will write a type for the response, so that i can use these values in the app in a type-save way.
- but not all of these values will be necessary, the only values i am interested in are: the width and height, the description of the image, the username (of the user that posted the image), and the urls that contain the actual image (raw one is enough, because i will resize the image through nextjs anyway)
- create models/unsplash-image.ts (doesnt contain html so its not a tsx!)
- there define an interface that defines how the type should look like (for this mapping to work, the keys of the interface/type must be exactly the same as the keys from the response!)
- as said: i want to also get the user, which is a nested object with the username in it, and has to be nested in the type as well

## static rendering

With these presets i now create a page, that behaves similar to the hello page. 

It fetches the data at compile time and then it caches the static page until you compile the project again.

- created in folder "static"

---

Dynamic rendering

- create another page, where you fetch data from the exact same endpoint, but instead of rendering and caching the page at compile time, i want to make a request every time a user opens or refreshes the page. 
- created in folder "dynamic"
- little trick: as you know, the folder structure defines the routes. If you put e.g. static into a subfolder, then this subfolder would be part of the url as well, but what if you want to organize the different page folders into subfolders without these subfolders effecting the url? For this you only have to put the folder name in parenthetis:\
  app/(SSR)/static,  or: app/(SSR)/dynamic\
  with those folders you defined the routes: /static and /dynamic 
- its pretty much the same as the page.tsx of the static but with a special revalidate variable set to 0, which means dont cache, revalidate each time (this is the equivalent of server side props in the pages directory in older NextJS versions)
- instead of setting revalidate for the whole page, you could also set it for a specific fetch call 

- if you now build the project again (npm run build), you could see a list of static and dynamic routes in the console (the Lambda represents the dynamic rendering at runtime and the circle the static at compile time)

  λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)

  ○  (Static)  automatically rendered as static HTML (uses no initial props)

  


