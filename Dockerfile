# 1️⃣ Use an official Node.js image as the base
FROM node:20

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# 4️⃣ Install all dependencies
RUN npm install

# 5️⃣ Copy the rest of your project into the container
COPY . .

# 6️⃣ Build the Next.js app
RUN npm run build

# 7️⃣ Expose port 3000 (Next.js default)
EXPOSE 3000

# 8️⃣ Command to run the app
CMD ["npm", "start"]
