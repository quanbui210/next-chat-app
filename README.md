This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

When running the application, especially with Docker, you will need to set the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project. This is required for the application to connect to your Supabase backend.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous public key for your Supabase project. This is used for accessing public data and performing anonymous operations.

These variables should be provided when starting your Docker container. For example, using the `-e` flag with `docker run`:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="your_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key" \
  your_image_name
```

## Running with Docker

This section provides instructions on how to build and run the application using Docker.

### 1. Build the Docker Image

First, build the Docker image for the application. Open your terminal in the root directory of the project (where the `Dockerfile` is located) and run the following command:

```bash
docker build -t chat-app .
```
This command tells Docker to build an image from the `Dockerfile` in the current directory (`.`) and tag it (`-t`) with the name `chat-app`.

### 2. Run the Docker Container

Once the image is built, you can run it as a container. You'll need to provide the environment variables discussed in the "Environment Variables" section.

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="your_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key" \
  chat-app
```

**Important:** Replace `"your_supabase_url"` and `"your_supabase_anon_key"` with your actual Supabase project URL and anonymous key.

This command will:
- Run the `chat-app` image.
- Map port `3000` of the container to port `3000` on your host machine (`-p 3000:3000`).
- Set the necessary environment variables (`-e ...`).

You should then be able to access the application at `http://localhost:3000` in your browser.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
