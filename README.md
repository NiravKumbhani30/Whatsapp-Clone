# Chat App

This is a chat application built with Next.js on the client side and Node.js on the server side.

## Setup

### Prerequisites

- Node.js
- npm


To setup the client, follow these steps:

1. **Navigate to the client and server directory:**

```sh
cd client
cd server
```
<br/>

2. **Install dependencies on both client and server:**

```sh
npm i
```

3. **Setup your client and server `.env` file**

4. **After setup `.env` then setup your `firebaseConfig.js`**

5. **After follow 4 step then setup prisma**

```sh
npx prisma generate //to generate db
npx prisma db push //to push schemas in database
npx prisma studio //to watch database activity
```

6. **Run client and server side using:**

```sh
npm run dev //for client side
npm start //for server side
```

Now, you can open your browser and navigate to http://localhost:3000 to see the application in action.