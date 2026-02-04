# CRT Commander

A Toy Robot-style grid game with a retro CRT terminal UI, built with React + Vite.

## Gameplay

- Grid: 5×5 (wrap-around edges)
- Robot: place, rotate, move
- Walls: place walls to block movement

## Commands

- `PLACE_ROBOT row,col,facing` (facing: `NORTH|EAST|SOUTH|WEST`)
- `PLACE_WALL row,col`
- `MOVE`
- `LEFT`
- `RIGHT`
- `REPORT`

Rows/cols are `1..5`.

## Dev

```bash
npm install
npm run dev
npm run lint
```
