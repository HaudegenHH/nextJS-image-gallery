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

## Dynamic rendering

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

---

## ISR - Incremental static regeneration

With that approach you also cache the page statically but just for a certain time, and when you refresh the page after this time the revalidation gets triggered and you get a new response back.
With the revalidate options discussed on the dynamic/page.tsx you already know how that:
- either in the options object of the fetch method
- or (if you want to revalidate the whole page instead) you take the global revalidate variable to set the time.

---

## Dynamic Urls

..means that you put a variable into the url (a certain keyword, a slug, an id,..) and then you use that to fetch some data for that keyword

- the url should look like: /topics/something
where topics will always be the same and the part after the last slash is dynamic
- in the (ignored (SSR)-Folder) you create the topics folder that represents the first part of the route
- for the second, dynamic part you have to create a folder with square brackets: [topic] 
..which is like the (SSR) folder not part of the url but instead replaced by the keyword
- in the old pages directory you also used square brackets but there you put it the filename of the page. Now you put it in the folder name because in here as usual you have to create a page.tsx
- in order to get the value out of the url, you have to add props to the page component. And as usual in typescript you create an interface for that: PageProps

- you can also tell nextJS to render these pages in advance
- lets say you want to render pages the keywords: health, fitness and coding and you want to render when you build the project
...then you can export another function "generateStaticParams"
(make sure the spelling is correct otherwise nextJS will not recognize this)
- this fn can be dynamic/async if you need to fetch some data in here and its the aquivalent of "getStaticPaths" in the old pages router, but the syntax is simpler now because of the return type
- you just have to return an array that contains the object keys 
- or you could export another value "dynamicParams" set to false; with that only the prefetched/-rendered pages will be shown or a 404 page

---

## clientside fetching

- you will have to set up an api route handler, a backend endpoint
- all the data fetching so far was serverside, meaning that you executed the api requests inside server components and returned the "ready" html with the data already inside it (either dynamically when you access the page or statically when you build the project) but sometimes you will need clientside fetching, which means that you first get empty html pages and then you execute some javascript that fetches data from an api and then shows it in the ui.
But instead of fetching serverside this happens in the browser of the user.
This is useful if you want to fetch some data dynamically and wait for the response without blocking the UI by waiting for the page to refresh. But its not as optimal because it requires a client component which means that you send more Javascript with code to the user, and it is also not so great for SEO, becuase search engine crawlers first see this empty page.
Nevertheless there are still some situations where you want to use clientside fetching.
For demonstrating purpose you create a search page where you have an input field, in which you can type in a keyword and search for related images.

First step: 

Create another folder "(CSR)" (clientside rendering), that is not part of the url.
 In order to execute the search clientside you will need useState() and useEffect() and this can only be used inside a client component ("use client" directive at the top).
And again: you will need this as a wrapper for the client component "SearchPage". And its necessary in this case because i declared metadata which needs to be in a server component.
And you could also fetch data in this server component and pass it via props to the client component. (but i want to demonstrate the client side fetching)
- in the SearchPage you can use a bootstrap Form element which again you can directly import from bootstrap because SearchPage is already a client component anyway (so you dont have to use the trick with the re-exported version)
  
After setting everything up you might wonder: The problem is that you are on the frontend inside the browser with the "use client" directive, this means: you cant use the credentials, becuase they would be leaked to the browser and s.o. could find if inspecting the source code, so unless you prefix the environment variable with "NEXT_PUBLIC", they will not be exposed to the frontend.

Test:\
console.log(process.env.UNSPLASH_ACCESS_KEY) // undefined

Therefore: When you fetch data client side and you need api access keys that should be kept secret, then you have to route this over your own backend server, because the backend server can execute this fetch call with the api key without exposing it to the client.
- so either you set up your own backend server (with express for example)
- or you use the api routes from NextJS with which you can build your backend directly in NextJS

## API Routes

- create an "app/api/search" folder (the url will start with "/api/search")
- you dont have to name it that way, but its the convention, because you usually want to put your route handlers behind "/api" endpoint, those are not pages, but server endpoints that just return some JSON.
- inside search put a route.tsx (again spelling must be the same otherwise it wont be recognized by NextJS as a route handler!)
- here you usually define the http requests (GET, POST, PUT,...)
- these fn could receive a Request object (which you dont need to import, because node comes with it as default)
- getting the searchParams out of the Request
- fetching from another endpoint this time: GET /search/photos
- for the response make a new interface in unsplash.image.ts where you already defined an interface for the response of a single image, therefore the response for this call contains a results array of Unsplash Images
- back to SearchPage: if you want to fetch client side you have to put it into state (so useState for the searchResults from the api route)
- you can explicitely tell NextJS what type is expected (UnsplashImage array or null, separated by one pipe in NextJS <UnsplashImage[] | null>) 
- then you need to track the loading state and the corresponding error state (which will be set to true if something went wrong with the fetch request and you want to show an error message instead)\
**Note:**
In a small project like this its ok to manage these states for the loading and the error state yourself but in production apps you should use a library like "SWR" for client side fetching which adds a lot of features like automatic caching, race condition prevention, deduplication, etc. In other words it does a lot of things that NextJS does serverside but on the client side!
Call to endpoint: 
- first you set the existing setSearchResults to null, so that the result list gets empty again (because instead you want to e.g. show a loading spinner)
- also set the error (back) to false (because if there was an error for the last request and you send a new one, then you want to remove the error message)
- also set loading to true 
- then finally make the actual fetch request to the endpoint
- again: this detour over your own backend route is neccessary because you cant put any api credentials into the client code. **So the actual request to the Unsplash Api has to happen on the server!**
- dont forget to use a try catch because its an asynchronous request that can throw an error!
- log this error to the console and in the finally block you can set the isLoading boolean back to false (to stop the loading spinner in the UI)

---

## Deploying on Vercel

In order to deploy on vercel you need a github repository.
- after pushing the whole project to this repo visit:
https://vercel.com
- here you want to create an account with the same github account that your project is on
- if you already have a vercel account, which is not connected to the project, you can manage that in the "personal account settings" (update login connections)
- go to the dashboard and add a new project
- then all the repos on your github account should be listed and you can simply choose which one you want to host by
- first clicking on import 
- configure the project which means you have the possibility to set environment variables, so in our case the UNSPLASH_ACCESS_KEY (which will be encrypted)
- and press "Deploy"
- after less than a minute the project should be build and deployed, with a "https://[projectName].vercel.app" address.

Done! 

  
**Note:**\
The cool thing about deploying your nextJS project on Vercel is that 
continous deployment is automatically set up.
That means that whenever you make changes to the code and push it to the main branch of the github repo, then Vercel will automatically go ahead and re-deploy these changes! 


