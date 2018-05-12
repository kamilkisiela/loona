import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { PostsComponent } from './posts/posts.component';
import { PostListComponent } from './post-list/post-list.component';
import { UpvoteComponent } from './upvote/upvote.component';

const COMPONENTS = [PostsComponent, PostListComponent, UpvoteComponent];

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class PostsModule {}
