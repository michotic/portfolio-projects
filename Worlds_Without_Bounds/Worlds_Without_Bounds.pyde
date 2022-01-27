'''
Made by Michael Taylor on Oct. 18, 2020

Isometric procedural engine
Uses 2D heightmap for overworld and 3D noise for cave networks
'''

worldLength = 9

TILE_SIZE = 64
NOISE_STEP = 0.1

viewPos = PVector(0, 0, 0)

def setup():
    noSmooth()
    size(600, 600)
    background(50)
    loadTextures()
    imageMode(CENTER)
        
    global player, tileList
    tileList = [] 
    
    isoPos = convertToIso((3 / 1) * (TILE_SIZE / 2), (3 / 1) * (TILE_SIZE / 2))
    player = Player(4, 4, 4)
        
    worldGen()
    depthSorting()

def loadTextures():
    global tileSprites, playerSprites
    tileSprites = []
    playerSprites = []

    tileSprites.append(loadImage("tile_air.png"))
    tileSprites.append(loadImage("tile_grass.png"))
    tileSprites.append(loadImage("tile_stone.png"))
    tileSprites.append(loadImage("tile_bedrock.png"))

    playerSprites.append(loadImage("player/player.png"))

def draw():
    for tile in tileList:
        tile.drawn = False

def keyReleased():
    playerDestination = PVector(0,0)
    if key == "x":
        save("screenshot.png")
    if key == "w":
        viewPos.x -= NOISE_STEP
    if key == "s":
        viewPos.x += NOISE_STEP
    if key == "a":
        viewPos.y += NOISE_STEP
    if key == "d":
        viewPos.y -= NOISE_STEP
    if keyCode == SHIFT:
        viewPos.z -= NOISE_STEP
    if key == " ":
        viewPos.z += NOISE_STEP
    
    viewPos.x = round(viewPos.x, 2)
    viewPos.y = round(viewPos.y, 2)
    viewPos.z = round(viewPos.z, 2)
    
    worldGen()
    depthSorting()

def worldGen():
    del tileList[:]
    background(50)
    noiseDetail(4, 0.2)

    xoff = viewPos.x
    for x in range(worldLength):
        yoff = viewPos.y
        for y in range(worldLength):
            zoff = viewPos.z
            for z in range(worldLength):
                
                noiseVal2D = noise(xoff, yoff)
                finalNoiseVal2D = pow(noiseVal2D, 2) * 50
                
                
                noiseVal3D = noise(xoff, yoff, zoff)
                
                isoPos = convertToIso((x / 1) * (TILE_SIZE / 2), (y / 1) * (TILE_SIZE / 2))
                
                currentLayer = round(z + (viewPos.z * 20), 2)
                
                if currentLayer > worldLength - 8  and currentLayer < worldLength:
                    if finalNoiseVal2D + 1 > currentLayer:
                        tileList.append(Tile(x, y, z, 1))
                    else:
                        tileList.append(Tile(x, y, z, 0))
                
                elif noiseVal3D > 0.25 and currentLayer <= worldLength - 8:
                    tileList.append(Tile(x, y, z, 2))
                else:
                    tileList.append(Tile(x, y, z, 0))

                zoff += NOISE_STEP
            yoff += NOISE_STEP
        xoff += NOISE_STEP

def depthSorting():
    fill(255)
    textSize(12)
    text('[X, Y, Z]' + str(viewPos), 15, 25)
    text('WASD to move around', 15, 50)
    
    player.drawn = False
    player.tileBelow = True
    player.zAdjust()
    
    for i in range(int(pow(worldLength, 3))):
        for tile in tileList:
            if tile.renderOrder == i and tile.drawn == False:
                tile.display()
                if tile.pos == player.pos and tile.type == 0:
                    player.tileBelow = False
                    if player.tileBelow == False:
                        viewPos.z -= NOISE_STEP
                        worldGen()
                        depthSorting()
                    
        if player.renderOrder == i:
            player.display()
        
def getTileCol(x, y):
    colTiles = []
    for tile in tileList:
        if tile.pos.x == x and tile.pos.y == y:
            colTiles.append(tile)
            
    return colTiles

def convertToIso(x, y):
    isoX = x - y
    isoY = (x + y) / 2
    isoPos = PVector(isoX, isoY)

    return isoPos

def convertToCart(x, y):
    cartX = (2 * y + x) / 2
    cartY = (2 * y - x) / 2
    cartPos = PVector(cartX, cartY)

    return cartPos

def diff(num1, num2):
    return num2 - num1

class Tile(object):

    def __init__(self, x, y, z, type):
        self.pos = PVector(x, y, z)
        self.drawn = False
        self.type = int(type)
        self.renderOrder = x + y + z

    def display(self):
        self.drawn = True
        renderedPos = convertToIso(self.pos.x * (TILE_SIZE / 2), self.pos.y * (TILE_SIZE / 2))
        renderedPos.x = renderedPos.x + (width / 2)
        renderedPos.y = renderedPos.y - ((self.pos.z / 2) * TILE_SIZE) + (height / 2)

        if width > -TILE_SIZE * 2 and height > - TILE_SIZE * 2 and self.type != 0:
            image(tileSprites[self.type],
                  renderedPos.x,
                  renderedPos.y,
                  TILE_SIZE,
                  TILE_SIZE * 2)

    def update(self, x, y, z, type):
        self.pos = PVector(x, y, z)
        self.drawn = False
        self.type = int(type)
        
        self.display()

class Player(object):
    
    def __init__(self, x, y, z):
        self.pos = PVector(x, y, z)
        self.renderOrder = x + y + z
        self.tileBelow = True
        
    def display(self):
        self.drawn = True
        
        self.renderOrder = self.pos.x + self.pos.y + self.pos.z
        renderedPos = convertToIso(self.pos.x * (TILE_SIZE / 2), self.pos.y * (TILE_SIZE / 2))
        renderedPos.x = renderedPos.x + (width / 2)
        renderedPos.y = renderedPos.y - ((self.pos.z / 2) * TILE_SIZE) + (height / 2)
        
        image(playerSprites[0],
            renderedPos.x,
            renderedPos.y,
            TILE_SIZE,
            TILE_SIZE * 2)
        
    def zAdjust(self):
        tiles = getTileCol(self.pos.x, self.pos.y)
        minZ = 0
        
        for tile in tiles:
            if tile.type > 0:
                if tile.pos.z > minZ:
                    minZ = tile.pos.z
                
        if minZ < self.pos.z + 3:
            self.pos.z = minZ
        else:
            viewPos.z += NOISE_STEP
            worldGen()
            depthSorting()
        self.renderOrder = self.pos.x + self.pos.y + self.pos.z
        
