<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# NestJS+mongoose ??????CRUD

## ????????????

- ??????MongoDB
- ????????????
- ?????? localhost:3000/api-docs ?????? ??????swagger-ui ??????

## ??????????????????

#### @typegoose/typegoose

>  npm i --save @typegoose/typegoose

#### @nestjs/mongoose mongoose

> $ npm install --save @nestjs/mongoose mongoose

#### class-validator class-transformer

> $ npm i --save class-validator class-transformer

## ????????????

### ????????????

**app.module.ts**

???????????? ??????typegoose ???????????????

?????????????????????https://nestjs.bootcss.com/techniques/mongo

```typescript
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

//?????? typegoose ??????mongodb?????????
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

- ??????swagger
- ???????????????????????????
- ???????????????????????? 

?????????????????????????????????????????? ????????????

?????????https://nestjs.bootcss.com/pipes#global-scoped-pipes

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // ????????? ??????
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Nest ??????API')
    .setDescription('???????????????nest??????')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

### ????????????

**post.model.ts**

???????????????????????????????????????????????? ????????????

```typescript
import { prop } from '@typegoose/typegoose'
//???????????? ?????? model ???controller?????????module???????????????
export class Post {
    @prop()
    title: string
    @prop()
    content: string
}
```

**posts.module.ts**

posts?????????

??????@Module????????????Post??????

???????????? PostsController

```typescript
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Post } from './post.model';
import { PostsController } from './posts.controller';

@Module({
  // ??????????????? Post??????
  imports:[TypegooseModule.forFeature([Post])],
  controllers: [PostsController]
})
export class PostsModule {}
```

**posts.controller.ts**

**posts ??????**

```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { IsNotEmpty } from 'class-validator';
import { InjectModel } from 'nestjs-typegoose';
import {Post as PostSchema} from './post.model'

class CreatePostDto {
    @ApiProperty({description:'????????????',example:"????????????"})
    // ???????????? ?????????
    @IsNotEmpty({message:'???????????????'})
    title:string
    @ApiProperty({description:'????????????',example:"????????????"})
    content:string
}
@ApiTags('??????')
@Controller('posts')
export class PostsController {
    // ????????????
    constructor(
        @InjectModel(PostSchema) private readonly PostModel:ModelType<PostSchema>
    )
    {}
    // ????????????
    @Get()
    @ApiOperation({ summary: "??????????????????" })
   async index() {
        return await this.PostModel.find();
    }
    // ????????????
    @Post()
    @ApiOperation({ summary: "????????????" })
    async create(@Body() createPostDto:CreatePostDto) { //???????????????
        await this.PostModel.create(createPostDto)
        return {
            success: true
        }
    }
    // ????????????
    @Get(':id')
    @ApiOperation({summary:"????????????"})
    async detail(@Param('id') id:string) {
        return  await this.PostModel.findById(id);
    }
    // ????????????
    @Put(':id')
    @ApiOperation({summary:"????????????"})
    async update(@Param('id') id:string, @Body() updatePostDto:CreatePostDto){
        await this.PostModel.findByIdAndUpdate(id,updatePostDto)
        return {
            success:true,
            id:id,
            title:updatePostDto.title,
            content:updatePostDto.content
        }
    }
    // ????????????
    @Delete(':id')
    @ApiOperation({summary:"????????????"})
    async remove(@Param('id') id:string){
        await this.PostModel.findByIdAndDelete(id)
        return {
            success:true,
            id:id
        }
    }

}

```

