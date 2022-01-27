cellGrid sim;
boolean paused = true;
int gridSize = 16;
void setup()
{
  size(512, 512);
  //fullScreen();
  frameRate(60);
  sim = new cellGrid(gridSize);
  background(0);
}

void draw()
{
  if (!paused)
  {
    sim.nextGeneration();
    sim.render();
  } else {
    for (int x = 0; x < width; x+= gridSize)
    {
      for (int y = 0; y < height; y+= gridSize)
      {
        push();
        noFill();
        stroke(50);
        strokeWeight(1);
        rect(x, y, gridSize, gridSize);
        pop();
      }
    }
  }
  
}

void keyPressed()
{
  if (key == ' ')
  {
    paused = !paused;
  }
}

void mousePressed()
{
  sim.addCell(mouseX, mouseY);
}

void mouseDragged()
{
  sim.addCell(mouseX, mouseY);
}
