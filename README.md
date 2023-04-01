# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Blueprint for development

### Phase 1: Task app

- Add, toggle completion, and delete tasks
- Search for tasks
- Fiilter tasks based on completed state

### Phase 2: Authentication

- Sign in and sign out
- Tasks are associated with each user
- Add account-specific statuses for each task instead of toggle

### Phase 3: Organizations

- User can create organization
- Organization owner can invite other users to join
- Organization can have "spaces" where tasks are stored
- Users are added to spaces. Not every user can see all organization spaces

### Phase 4: Paid plans

- Stripe integration
- Limits number of users in organization
- Limits number of spaces in organization
- Limits amount of tasks in organization

### Plans

1. Basic - 3 users, 5 spaces, 1,000 tasks
2. Plus - 10 users, 15 spaces, 10,000 tasks
3. Pro - 50 users, 100 spaces, 500,000 tasks
4. Enterprise - 1,000 users, unlimited spaces, unlimited tasks

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
