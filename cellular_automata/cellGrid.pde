class cellGrid
{
  // Will be the data structure used to handle and organize cells
  int[][] cells; // 2D array of 0s and 1s
  int curGen; // Current generation of cell
  int cellSize;
  int simWidth, simHeight;
  
  int[][] rules;
  
  cellGrid(int gridSize)
  {
    cellSize = gridSize;
    simWidth = int(width / cellSize);
    simHeight = int(height / cellSize);
    cells = new int[simWidth][simHeight];
    restart();
  }
  
  void restart() {
    for (int x = 0; x < cells.length; x++) {
      for (int y = 0; y < cells[x].length; y++) {
        cells[x][y] = 0;
      }
    }
    
    //cells[simWidth / 2][simHeight / 2] = 1;
    
    curGen = 0;
  }
  
  void nextGeneration()
  {
    int[][] newGen = new int[cells.length][cells.length];
    
    for (int x = 0; x < cells.length; x++) {
      for (int y = 0; y < cells[x].length; y++) {
        int neighbours = getNumOfNeighbours(x, y);
        newGen[x][y] = gameOfLife(cells[x][y], neighbours);
      }
    }
    
    for (int x = 0; x < cells.length; x++) {
      for (int y = 0; y < cells[x].length; y++) {
        cells[x][y] = newGen[x][y];
      }
    }
    curGen++;
  }
  
    int getNumOfNeighbours(int x, int y)
  {
    
    int left = x - 1;
    int right = x + 1;
    int up = y - 1;
    int down = y + 1;
    int neighbours = 0; // # of surrounding cells
    
    if (left < 0)
    {
      left = simWidth - 1;
    }
    if (right > simWidth - 1)
    {
      right = 0;
    }
    if (down > simHeight - 1)
    {
      down = 0;
    }
    if (up < 0)
    {
      up = simHeight - 1;
    }
    
    neighbours += cells[left][up];
    neighbours += cells[x][up];
    neighbours += cells[right][up];
    neighbours += cells[left][y];
    neighbours += cells[right][y];
    neighbours += cells[left][down];
    neighbours += cells[x][down];
    neighbours += cells[right][down];
    
    return neighbours;
  }
  
  void render()
  {
    for (int x = 0; x < cells.length; x++) {
      for (int y = 0; y < cells[x].length; y++) {
        if (cells[x][y] == 1) { fill(255); } else { fill(0); }
        noStroke();
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    } 
  }
  
  int gameOfLife(int x, int n) // x = cell val, n = # of neighbours
  {
    // GoL rules. Default = 3/23 (3 to reprod, min 2, max 3)
    int popIdeal = 3; // If cell is dead and has this # of neighbours, will become live due to reprod
    //int popIdealMax = 3;
    
    int popMin = 2; // If lower dies of underpop
    int popMax = 3; // If over dies of overpop
    
    if (x != 0)
    {
      // if alive
      if (n < popMin || n > popMax)
      {
        return 0;
      } else {
        return 1;
      }
    } else {
      // if dead
      if (n == popIdeal)
      {
        return 1;
      }
      return 0;
    }
  }
  
  void addCell(int x, int y)
  {
    int gridX = round(x / cellSize);
    int gridY = round(y / cellSize);
    gridX = constrain(gridX, 0, simWidth - 1);
    gridY = constrain(gridY, 0, simHeight - 1);
    if (cells[gridX][gridY] == 0) {cells[gridX][gridY] = 1;} else {cells[gridX][gridY] = 0;} 
    render();
  }
  
}
