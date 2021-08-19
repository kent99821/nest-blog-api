# NestJS+mongoose 实现CRUD

## 项目运行

- 启动MongoDB
- 启动项目：start:dev 或使用命令行 nest start --watch
- 访问 localhost:3000/api-docs 即可 看到swagger-ui 界面

## 部分环境安装

#### @typegoose/typegoose

>  npm i --save @typegoose/typegoose

#### @nestjs/mongoose mongoose

> $ npm install --save @nestjs/mongoose mongoose

#### class-validator class-transformer

> $ npm i --save class-validator class-transformer

## 项目目录

### 项目配置

**app.module.ts**

通过依赖 配置typegoose 连接数据库

写法可以参考：https://nestjs.bootcss.com/techniques/mongo

```typescript
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

//使用 typegoose 连接mongodb数据库
@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27017/nest-blog-api',{
      useNewUrlParser:true
    }),
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**main.ts**

- 配置swagger
- 配置项目的启动端口
- 使用管道（全局） 

管道：本项目用于限制输入格式 规范接口

参考：https://nestjs.bootcss.com/pipes#global-scoped-pipes

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // 中间件 管道
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Nest 文章API')
    .setDescription('我的第一个nest项目')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

### 项目内容

**post.model.ts**

模型定义：用于设置文章实体的属性 定义结构

```typescript
import { prop } from '@typegoose/typegoose'
//向外暴露 模型 model 在controller容器和module依赖中使用
export class Post {
    @prop()
    title: string
    @prop()
    content: string
}
```

**posts.module.ts**

posts模块：

使用@Module导入注册Post模型

设置容器 PostsController

```typescript
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Post } from './post.model';
import { PostsController } from './posts.controller';

@Module({
  // 导入和注册 Post模型
  imports:[TypegooseModule.forFeature([Post])],
  controllers: [PostsController]
})
export class PostsModule {}
```

**posts.controller.ts**

**posts 容器**

```typescript
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

```

