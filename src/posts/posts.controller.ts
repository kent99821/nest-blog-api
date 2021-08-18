import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PostModel } from './post.model';


class CreatePostDto {
    @ApiProperty({description:'帖子标题',example:"帖子标题"})
    title:string
    @ApiProperty({description:'帖子内容',example:"帖子内容"})
    content:string
}
@ApiTags('帖子')
@Controller('posts')
export class PostsController {
    @Get()
    @ApiOperation({ summary: "显示帖子列表" })
   async index() {
        return await PostModel.find();
    }

    @Post()
    @ApiOperation({ summary: "创建帖子" })
    async create(@Body() createPostDto:CreatePostDto) { //参数装饰器
        await PostModel.create(createPostDto)
        return {
            success: true
        }
    }
    @Get(':id')
    @ApiOperation({summary:"帖子详情"})
    async detail(@Param('id') id:string) {
        return  await PostModel.findById(id);
    }
    @Put(':id')
    @ApiOperation({summary:"编辑帖子"})
    async update(@Param('id') id:string, @Body() updatePostDto:CreatePostDto){
        await PostModel.findByIdAndUpdate(id,updatePostDto)
        return {
            success:true,
            id:id,
            title:updatePostDto.title,
            content:updatePostDto.content
        }
    }
    @Delete(':id')
    @ApiOperation({summary:"删除帖子"})
    async remove(@Param('id') id:string){
        await PostModel.findByIdAndDelete(id)
        return {
            success:true,
            id:id
        }
    }

}
