import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../models';
import { postsQuery } from '../flux/queries';
import { UpvoteMutation } from '../flux/mutations';
import { ApolloFlux } from '../../apollo-flux';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: Observable<Post[]>;

  constructor(private apolloFlux: ApolloFlux) {}

  ngOnInit() {
    this.posts = this.apolloFlux
      .query<{ posts: Post[] }>({
        query: postsQuery,
      })
      .valueChanges.pipe(map(result => result.data.posts));
  }

  onUpvote(post: Post) {
    this.apolloFlux.dispatch(new UpvoteMutation(post.id));
  }
}
