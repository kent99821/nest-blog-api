import { Controller, Get, Post } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    @Get()
    index(){
        return [1,2,3]
    }

    @Post()
    create(){
        return {
            success:true
        }
    }
    @Get(':id')
    detail(){
        return {
            id:1,
            title:'aaaqa'
        }
    }

}
