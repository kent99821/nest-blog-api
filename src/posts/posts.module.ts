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
