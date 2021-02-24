import { jsonProperty } from '../../src/JsonConvert';
import Post from './Post';

class Posts {
  @jsonProperty('page')
  public page: string;

  @jsonProperty('posts', [Post])
  public posts: Post[];
}

export default Posts;
