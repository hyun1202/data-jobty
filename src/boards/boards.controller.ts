import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { Board, BoardStatus } from "./board.model";
import { CreateBoardDto } from "./dto/create-board-dto";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("Community")
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}
  @Get('/')
  getAllBoard(): Board[] {
    return this.boardsService.getAllBoards()
  }
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto
  ) :Board {
    return this.boardsService.createBoard(createBoardDto)
  }
  @Get('/:id')
  getBoardById(@Param('id') id:string){
    return this.boardsService.getBoardById(id)
  }
  @Delete('/:id')
  deleteBoard(@Param('id') id:string): void {
    this.boardsService.deleteBoard(id);
  }
  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id') id:string,
    @Body('status') status: BoardStatus
  ) {
    return this.boardsService.updateBoardStatus(id,status);
  }
}
