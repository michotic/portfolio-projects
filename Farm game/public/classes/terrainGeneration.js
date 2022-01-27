function createTerrain(worldWidth) {
  xInc = 1
  for (var x = -worldWidth; x < worldWidth; x++) {
    for (var y = -worldWidth; y < worldWidth; y++) {
      tileList.push(
        new tileObject(
          x * TILE_SIZE + int(width / 2 / TILE_SIZE) * TILE_SIZE,
          y * TILE_SIZE + int(height / 2 / TILE_SIZE) * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0,
          0
        )
      )
    }
  }
  layersDone = false
  print('World Size: ' + tileList.length + ' tiles')
  generateTiles()

  tileList.push(
    new tileObject(
      worldWidth * TILE_SIZE +
        int(width / 2 / TILE_SIZE) * TILE_SIZE -
        TILE_SIZE +
        TILE_SIZE * 3,
      int(worldWidth / 2) * TILE_SIZE + int(height / 2 / TILE_SIZE) * TILE_SIZE,
      TILE_SIZE * 2,
      TILE_SIZE,
      0,
      2
    )
  )

  interactiveList.push(tileList[tileList.length - 1])

  for (var i = 0; i < 3; i++) {
    tileList.push(
      new tileObject(
        worldWidth * TILE_SIZE +
          int(width / 2 / TILE_SIZE) * TILE_SIZE -
          TILE_SIZE +
          TILE_SIZE * i,
        int(worldWidth / 2) * TILE_SIZE + int(height / 2 / TILE_SIZE) * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        0,
        1
      )
    )
  }
}
