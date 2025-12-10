FROM node:22.20.0-alpine

WORKDIR /usr/src/app

# Copy everything first
COPY . .

# Remove any existing node_modules and cache
RUN rm -rf node_modules .vite

# Install dependencies
RUN npm install

# Make everything writable
RUN chmod -R 777 /usr/src/app

# Expose Vite dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]