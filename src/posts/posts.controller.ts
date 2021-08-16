import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';


class CreatePostDto {
    @ApiProperty({description:'帖子标题'})
    title:string
    @ApiProperty({description:'帖子内容'})
    content:string
}
@ApiTags('帖子')
@Controller('posts')
export class PostsController {
    @Get()
    @ApiOperation({ summary: "显示帖子列表" })
    index() {
        return [1, 2, 3]
    }

    @Post()
    @ApiOperation({ summary: "创建帖子" })
    create(@Body() body:CreatePostDto) { //参数装饰器
        body
        return {
            success: true
        }
    }
    @Get(':id')
    @ApiOperation({summary:"帖子详情"})
    detail(@Param('id') id:string) {
        return {
            id: id,
            title: 'aaaqa'
        }
    }
    @Put(':id')
    @ApiOperation({summary:"编辑帖子"})
    update(@Param('id') id:string, @Body() body:CreatePostDto){

        return {
            success:true,
            id:id,
            title:body.title,
            content:body.content
        }
    }
    @Delete(':id')
    @ApiOperation({summary:"删除帖子"})
    remove(@Param('id') id:string){
        return {
            success:true,
            id:id
        }
    }

}
