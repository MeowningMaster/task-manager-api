FROM oven/bun:1 as base
ENV NODE_ENV=production
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
# RUN bun test
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist/main.js .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/config config
COPY --from=prerelease /usr/src/app/migrations migrations
RUN chown bun .
USER bun
EXPOSE 5000/tcp
ENTRYPOINT [ "bun", "run", "main.js" ]
