import { Injectable, NotFoundException } from "@nestjs/common";
import { BoardStatus } from "./board-status.enum";
import { CreateBoardDto } from "./dto/create-board-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./board.entity";
import { Repository } from "typeorm";
@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ) {}

  async getAllBoards():Promise<Board[]> {
    return this.boardRepository.find();
  }
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC
    })
    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOneBy({id:id});

    if (!found) {
      throw new NotFoundException(`존재하지 않는 게시물 입니다. ${id}`);
    }

    return found;
  }
  async deleteBoard(id:number):Promise <void> {
    const result = await this.boardRepository.delete(id)
    if (result.affected === 0){
      throw new NotFoundException(`찾을 수 없는 게시물 입니다.${id}`)
    }
  }
  async updateBoardStatus(id: number, status: BoardStatus):Promise<Board> {

    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
}
