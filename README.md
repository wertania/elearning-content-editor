# Wiki-Content-Editor

Full toolset for you documentation with text, video, PDF and more.
Also includes an editor and a viewer for the documentation.

An AI-Search is also included to search the whole wiki for a specific question.

## Attention!!!

This app is still in development and not ready for production use.

## This Repository

This contains a Mono Repo for all necessary tools for the e-learning platform.
Dependencies cannot be shared since Vercel and Railway do not support that.

```
.
-| aisearch = Python backend to resolve a users question against the whole wiki
-| assets = Static project assets
-| editor = Vue Frontend for Editor and Live-Viewer
-| markdown-import = Import Python Tools
-| viewer = VitePress Static renderer
```

## Installation via docker-compose

### .env

Copy the `.env.example` to `.env` and fill in the necessary information.

## Start and build

```sh
docker-compose up
```

## Init the database

You must now install the database in pocketbase. For that go to:
```
http://localhost:8080/_/
```

Register with some user. That will be droped in the next steps.

Go to "Settings" > "Backups" > and restore the backup from `./assets/empty-pb-template.zip` here.

Now the default login will be:
```
b.enders@mydomain.com
hello-there-123
```
