function dialogueObject ( x,
    y,
    string )
{
    this.xpos = -xOffset;
    this.ypos = y;
    this.dialogue = string;
    this.life = this.dialogue.length * 7;

    this.outerBoxHeight = TILE_SIZE / 2;
    this.innerBoxHeight = PIXEL_SIZE * 6;
    this.innerBoxWidth = PIXEL_SIZE * 3.5 * this.dialogue.length;
    this.outerBoxWidth = this.innerBoxWidth + ( PIXEL_SIZE * 2 )

    this.draw = function ()
    {
        this.xpos = - xOffset;
        this.life--;
        textFont( dialogueFont );
        textSize( DIALOGUE_FONT_SIZE );
        /*fill( 155, 159, 226 );
        rect( width / 2, playerVar.ypos - TILE_SIZE, this.outerBoxWidth, this.outerBoxHeight );
        fill( 170, 174, 246 );
        rect( playerVar.xpos, playerVar.ypos - TILE_SIZE, this.innerBoxWidth, this.innerBoxHeight );*/
        fill( 255 );
        text( this.dialogue, playerVar.xpos, height - TILE_SIZE + ( DIALOGUE_FONT_SIZE / 4 ) );
    }
}