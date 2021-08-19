import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { IsNotEmpty } from 'class-validator';
import { InjectModel } from 'nestjs-typegoose';
import {Post as PostSchema} from './post.model'

class CreatePostDto {
    @ApiProperty({description:'文章标题',example:"文章标题"})
    // 管道限制 不为空
    @IsNotEmpty({message:'请填写标题'})
    title:string
    @ApiProperty({description:'文章内容',example:"文章内容"})
    content:string
}
@ApiTags('文章')
@Controller('posts')
export class PostsController {
    // 使用模型
    constructor(
        @InjectModel(PostSchema) private readonly PostModel:ModelType<PostSchema>
    )
    {}
    // 显示列表
    @Get()
    @ApiOperation({ summary: "显示文章列表" })
   async index() {
        return await this.PostModel.find();
    }
    // 创建文章
    @Post()
    @ApiOperation({ summary: "创建文章" })
    async create(@Body() createPostDto:CreatePostDto) { //参数装饰器
        await this.PostModel.create(createPostDto)
        return {
            success: true
        }
    }
    // 查看详细
    @Get(':id')
    @ApiOperation({summary:"文章详情"})
    async detail(@Param('id') id:string) {
        return  await this.PostModel.findById(id);
    }
    // 编辑文章
    @Put(':id')
    @ApiOperation({summary:"编辑文章"})
    async update(@Param('id') id:string, @Body() updatePostDto:CreatePostDto){
        await this.PostModel.findByIdAndUpdate(id,updatePostDto)
        return {
            success:true,
            id:id,
            title:updatePostDto.title,
            content:updatePostDto.content
        }
    }
    // 删除文章
    @Delete(':id')
    @ApiOperation({summary:"删除文章"})
    async remove(@Param('id') id:string){
        await this.PostModel.findByIdAndDelete(id)
        return {
            success:true,
            id:id
        }
    }

}
