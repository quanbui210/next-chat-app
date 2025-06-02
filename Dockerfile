# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm for dependency management if pnpm-lock.yaml exists, otherwise use npm
# This project uses npm based on the presence of package-lock.json
RUN npm install -g pnpm

# Copy package.json and package-lock.json (or yarn.lock or pnpm-lock.yaml)
COPY package.json package-lock.json* ./
# If you have a pnpm-lock.yaml, uncomment the next line and comment out the npm ci line
# COPY pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# Install dependencies
# Use npm ci for cleaner installs with package-lock.json
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Set environment variables (placeholders, should be overridden at runtime)
ENV NODE_ENV=production
# Add any other necessary environment variables here as placeholders
# For example, Supabase variables:
# ENV NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_placeholder
# ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_placeholder

# Copy built assets from the builder stage
# If using default Next.js output (not standalone):
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# If you have a standalone output, you'd copy /app/.next/standalone and /app/.next/static
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
