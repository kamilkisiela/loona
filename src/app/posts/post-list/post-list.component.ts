import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Post } from '../models';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  @Input() posts: Post[];
  @Output('upvote') upvoted = new EventEmitter<Post>();

  onUpvote(post: Post) {
    this.upvoted.emit(post);
  }

  trackByFn(i: number, post: Post) {
    return post.id;
  }
}
