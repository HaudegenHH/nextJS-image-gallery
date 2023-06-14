
export default async function Page() {
  // artificial delay of 1 sec to demonstrate the loading screen
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // try out the error.tsx
  //   throw new Error('failed loading data..')
  return (
    <h1>Hello Page</h1>
  )
}
