FROM hayd/alpine-deno:1.7.0
EXPOSE 3000
WORKDIR /usr/app
COPY . .
CMD [ "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--config", "--import-map=import_map.json", "tsconfig.json", "server/server.tsx" ]
