# Wiki-Content-Editor

Visual editor to generate Markdown-based documentation for non-developers.

## BETA!

Do not use.

## Repository

An app that

Mono Repo for all necessary tools for the e-learning platform.
Dependencies cannot be shared since Vercel and Railway do not support that!

```
.
-| aisearch = Python backend to resolve a users question against the whole wiki
-| assets = Static project assets
-| editor = Vue Frontend for Editor and Live-Viewer
-| markdown-import = Import Python Tools
-| viewer = VitePress Static renderer
```

## Running using `docker compose`

To start all services needed to run the project, run the following commands:

```sh
cd .dev
docker compose up
```

Note that `video-convert-service` is a one-off service. It terminates when it has finished its work. Therefore, it has to be restarted manually using `docker compose up video-convert-service` inside `.dev/`.
