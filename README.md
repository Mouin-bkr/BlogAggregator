# Gator

A CLI RSS feed aggregator(gator), built with TypeScript, Node, Drizzle ORM, and PostgreSQL. Register users, follow RSS feeds, periodically scrape them for new posts, and browse the latest posts from the feeds you follow — all from the terminal.

## Requirements

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally (or reachable via a connection string)

## Installation

Clone the repo and install dependencies:

```bash
npm install
```

### 1. Create the database

Create a Postgres database for the app (defaults used throughout this guide: user/password `postgres`, database `gator`):

```bash
createdb gator
```

If your Postgres connection details differ, update `dbCredentials.url` in [drizzle.config.ts](drizzle.config.ts) — it's used only for running migrations.

### 2. Run the migrations

```bash
npm run migrate
```

This creates the `users`, `feeds`, `feed_follows`, and `posts` tables.

### 3. Create your config file

Gator reads its runtime config from `~/.gatorconfig.json`. Create it manually with the database connection string:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator",
  "current_user_name": ""
}
```

`current_user_name` gets updated automatically by the `login`/`register` commands — you can leave it blank initially.

## Running commands

There's no global binary — run commands through npm, passing your arguments after `--`:

```bash
npm start -- <command> [args...]
```

For example:

```bash
npm start -- register alice
npm start -- addfeed "Lane's Blog" https://wagslane.dev/index.xml
npm start -- agg 1m
```

## Commands

| Command | Description |
|---|---|
| `register <name>` | Create a new user and log in as them |
| `login <name>` | Switch the current user |
| `reset` | Delete all users (and cascades to their feeds, follows, posts) |
| `users` | List all registered users, marking the current one |
| `addfeed <name> <url>` | Add a new RSS feed and automatically follow it |
| `feeds` | List all feeds added by any user |
| `follow <url>` | Follow an existing feed by its URL |
| `unfollow <url>` | Unfollow a feed by its URL |
| `following` | List the feeds the current user follows |
| `agg <duration>` | Continuously fetch the least-recently-fetched feed on a timer (e.g. `agg 1m`, `agg 30s`). Stop with `Ctrl+C` |
| `browse [limit]` | Show the latest posts from feeds the current user follows, newest first (default limit: `2`) |

Most commands (`addfeed`, `follow`, `unfollow`, `following`, `browse`) require a logged-in user — run `register` or `login` first.

## Example workflow

```bash
npm start -- register alice
npm start -- addfeed "Lane's Blog" https://wagslane.dev/index.xml
npm start -- agg 1m        # let this run for a bit, then Ctrl+C
npm start -- browse 5
```
